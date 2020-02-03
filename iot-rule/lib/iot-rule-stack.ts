import * as cdk from '@aws-cdk/core';

import lambda = require('@aws-cdk/aws-lambda');
import iot = require('@aws-cdk/aws-iot');

export class IotRuleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new lambda.Function(this, 'SomeRuleHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('./dist/index.zip')
    });

    new iot.CfnTopicRule(this, 'SomeRule', {
      ruleName: 'some-rule',
      topicRulePayload: {
        actions: [ { lambda: { functionArn: fn.functionArn }} ],
        sql: 'select * from topic',
        ruleDisabled: false
      }
    })
  }
}
