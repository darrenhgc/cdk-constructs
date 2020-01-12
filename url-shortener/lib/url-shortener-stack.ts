import * as cdk from '@aws-cdk/core';
import s3 = require('@aws-cdk/aws-s3');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');

export class UrlShortenerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'UrlShortnerBucket', {
      versioned: false,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html'
    });

    const code = lambda.Code.fromAsset('./dist/index.zip');

    const fn = new lambda.Function(this, 'UrlShortenerFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code,
      environment: {
        BUCKET_NAME: bucket.bucketName,
        DOMAIN: `http://${bucket.bucketWebsiteDomainName}`
      }
    });

    bucket.grantWrite(fn);

    const api = new apigw.RestApi(this, 'UrlShortenerRestApi', {
      restApiName: 'Url Shortening API',
      deployOptions: {
        stageName: 'dev'
      }
    });

    const links = api.root.addResource('links');

    const integration = new apigw.LambdaIntegration(fn);

    links.addMethod('PUT', integration);
  }
}
