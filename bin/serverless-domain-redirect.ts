#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { ServerlessDomainRedirectStack } from '../lib/serverless-domain-redirect-stack';

const app = new cdk.App();

const targetHost = app.node.tryGetContext('targetHost');
if (!targetHost)
  throw new Error(`Please specify 'targetHost' via context.`);

new ServerlessDomainRedirectStack(app, 
    'ServerlessDomainRedirectStack-' + targetHost.replace(/\./gi, '-'),
    { 
        env: { 
            region: process.env.CDK_DEFAULT_REGION,
            account: process.env.CDK_DEFAULT_ACCOUNT
        } 
    });
