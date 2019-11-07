# Serverless Domain Redirect
Create a serverless stack for implementing domain redirect on AWS without provisioning any machine.

## Prerequsistes

- Create a public hosted zone in Route 53 for your domain.
 
## Use AWS S3 and CloudFront for domain redirect

### How to deploy the Stack

```shell
cdk deploy -c hostedZone=aws.kane.mx -c targetHost=aws.kane.mx -c redirectHost=aws.amazon.com
```

## Use AWS Lambda and API Gateway for domain redirect requests

### How to deploy the Stack

```shell
cdk deploy -c hostedZone=aws.kane.mx -c targetHost=lambda.aws.kane.mx -c mode=lambda 
```