# Serverless Domain Redirect
Create a serverless stack for implementing domain redirect on AWS without provisioning any machine.

## Use AWS S3 and CloudFront for domain redirect

### Prerequsistes

- Create a public hosted zone in Route 53 for your domain.

### How to deploy the Stack

```shell
cdk deploy -c targerHost=aws.kane.mx -c redirectHost=aws.amazon.com
```

