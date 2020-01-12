import * as cdk from '@aws-cdk/core';
import s3 = require('@aws-cdk/aws-s3');
import lambda = require('@aws-cdk/aws-lambda');
import apigw = require('@aws-cdk/aws-apigateway');

interface UrlShortenerProps extends cdk.StackProps {
  domain?: string
}

export class UrlShortenerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: UrlShortenerProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'UrlShortnerBucket', {
      versioned: false,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html'
    });

    let domain = `http://${bucket.bucketWebsiteDomainName}`

    const code = lambda.Code.fromAsset('./dist/index.zip');
    if (props && props.domain) {
      domain = props.domain
    }

    const fn = new lambda.Function(this, 'UrlShortenerFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code,
      environment: {
        BUCKET_NAME: bucket.bucketName,
        DOMAIN: domain
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
