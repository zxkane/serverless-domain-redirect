import cdk = require('@aws-cdk/core');
import s3 = require("@aws-cdk/aws-s3");

export class ServerlessDomainRedirectStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create S3 bucket to redirect the request
    const targetHost = this.node.tryGetContext('targetHost');
    if (targetHost) {
      const bucket = new s3.Bucket(this, 'ServerlessDomainRedirectBucket',{
        websiteRedirect: { hostName: targetHost }
      });
    } else {
      throw new Error(`Please specify 'targetHost' via context.`);
    }
  }
}
