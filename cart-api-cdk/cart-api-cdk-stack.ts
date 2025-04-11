import * as cdk from 'aws-cdk-lib';
import { Cors } from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';

dotenv.config();

export class CartApiCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const cartApiLambda = new nodejs.NodejsFunction(this, 'CartApiLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'dist/main.lambda.js',
      handler: 'handler',
      bundling: {
        minify: false,
        sourceMap: true,
        externalModules: ['@aws-sdk/*', 'aws-sdk'],
        nodeModules: [
          '@nestjs/core',
          '@nestjs/common',
          '@nestjs/platform-express',
          'reflect-metadata',
          '@vendia/serverless-express',
        ],
      },
      memorySize: 1024,
      timeout: cdk.Duration.seconds(30),
      environment: {
        DB_HOST: process.env.DB_HOST || '',
        DB_PORT: process.env.DB_PORT || '5432',
        DB_NAME: process.env.DB_NAME || '',
        DB_USERNAME: process.env.DB_USERNAME || '',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        DB_DB: process.env.DB_DB,
      },
    });

    // Enable Function URL for public HTTP access
    const functionUrl = cartApiLambda.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'X-Amz-Date',
          'X-Api-Key',
          'X-Amz-Security-Token',
        ],
        allowCredentials: true,
        allowedOrigins: Cors.ALL_ORIGINS,
      },
    });

    // Output the function URL
    new cdk.CfnOutput(this, 'LambdaFunctionUrl', {
      value: functionUrl.url,
    });
  }
}
