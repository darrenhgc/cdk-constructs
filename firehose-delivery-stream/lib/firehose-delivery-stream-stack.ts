import * as cdk from '@aws-cdk/core';

import { Bucket } from '@aws-cdk/aws-s3';
import { CfnDeliveryStream } from '@aws-cdk/aws-kinesisfirehose';
import { Role, ServicePrincipal, PolicyStatement, Effect } from '@aws-cdk/aws-iam';

export class FirehoseDeliveryStreamStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'bucket');

    const role = new Role(this, 'role', {
      assumedBy: new ServicePrincipal('firehose.amazonaws.com')
    });

    const bucketPermissions = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        's3:AbortMultipartUpload',
        's3:GetBucketLocation',
        's3:GetObject',
        's3:ListBucket',
        's3:ListBucketMultipartUploads',
        's3:PutObject'
      ],
      resources: [
        bucket.bucketArn,
        `${bucket.bucketArn}/*`
      ]
    });
    
    role.addToPolicy(bucketPermissions);

    const bufferingHints: CfnDeliveryStream.BufferingHintsProperty = {
      intervalInSeconds: 60,
      sizeInMBs: 1
    }

    const s3DestinationConfiguration: CfnDeliveryStream.S3DestinationConfigurationProperty = {
      bucketArn: bucket.bucketArn,
      compressionFormat: 'gzip',
      bufferingHints,
      roleArn: role.roleArn
    }

    new CfnDeliveryStream(this, 'stream', {
      deliveryStreamName: 'MyStream',
      deliveryStreamType: 'DirectPut',
      s3DestinationConfiguration
    })
  }
}
