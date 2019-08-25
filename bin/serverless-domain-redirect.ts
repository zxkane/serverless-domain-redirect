#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { ServerlessDomainRedirectStack } from '../lib/serverless-domain-redirect-stack';

const app = new cdk.App();
new ServerlessDomainRedirectStack(app, 'ServerlessDomainRedirectStack');
