#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CartApiCdkStack } from './cart-api-cdk-stack';

const app = new cdk.App();
new CartApiCdkStack(app, 'CartApiCdkStack', {});
