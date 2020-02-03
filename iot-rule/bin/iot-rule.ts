#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { IotRuleStack } from '../lib/iot-rule-stack';

const app = new cdk.App();
new IotRuleStack(app, 'IotRuleStack');
