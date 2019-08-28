import cdk = require('@aws-cdk/core');
import s3 = require("@aws-cdk/aws-s3");
import cf = require("@aws-cdk/aws-cloudfront");
import route53 = require("@aws-cdk/aws-route53");
import targets = require('@aws-cdk/aws-route53-targets');
import certmgr = require("@aws-cdk/aws-certificatemanager");
import iam = require("@aws-cdk/aws-iam");

export class ServerlessDomainRedirectStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create S3 bucket to redirect the request
    const targetHost = this.node.tryGetContext('targetHost');
    const hostedZoneDomain = this.node.tryGetContext('hostedZone');
    const redirectHost = this.node.tryGetContext('redirectHost');

    if (!hostedZoneDomain)
      throw new Error(`Please specify 'hostedZone' via context.`);
    if (targetHost.indexOf(hostedZoneDomain) == -1)
      throw new Error(`Target host '${targetHost}' is not a sub domain of hosted zone '${hostedZoneDomain}'.`);
    if (!redirectHost)
      throw new Error(`Please specify 'redirectHost' via context.`); 

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: hostedZoneDomain,
      privateZone: false
    });

    if (!hostedZone)
      throw new Error(`Can not find public hosted zone '${targetHost}' in Route 53.`);

    const certificate = new certmgr.DnsValidatedCertificate(this, 'Certificate-' + targetHost, {
        domainName: targetHost,
        hostedZone,
        region: 'us-east-1', // especially for certificates used for CloudFront distributions
        validationDomains: { 
          targetHost: targetHost
        },
        validationMethod: certmgr.ValidationMethod.DNS
    });

    const bucket = new s3.Bucket(this, 'ServerlessDomainRedirectBucket-' + targetHost, {
      websiteRedirect: {
        hostName: redirectHost
      }
    });

    const distribution = new cf.CloudFrontWebDistribution(this, 'BucketDistribution-' + targetHost, {
      originConfigs: [
          {
              customOriginSource: {
                domainName: cdk.Fn.select(1, cdk.Fn.split('http://', bucket.bucketWebsiteUrl)),
                httpPort: 80,
                originProtocolPolicy: cf.OriginProtocolPolicy.HTTP_ONLY,
              },
              behaviors : [ {isDefaultBehavior: true}]
          }
      ],
      aliasConfiguration: { 
        acmCertRef: certificate.certificateArn, // must provide certifcate when specifying cnames
        names: [
          targetHost
        ],
        securityPolicy: cf.SecurityPolicyProtocol.TLS_V1_1_2016,
        sslMethod: cf.SSLMethod.SNI
      },
      defaultRootObject: '',
      priceClass: cf.PriceClass.PRICE_CLASS_200
    });

    new route53.ARecord(this, 'AAlias-' + targetHost, {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });
    new route53.AaaaRecord(this, 'AaaaAlias-' + targetHost, {
      zone: hostedZone,
      target: route53.AddressRecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
    });
  }
}
