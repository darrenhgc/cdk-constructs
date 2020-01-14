#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { FirehoseDeliveryStreamStack } from '../lib/firehose-delivery-stream-stack';

const app = new cdk.App();
new FirehoseDeliveryStreamStack(app, 'FirehoseDeliveryStreamStack');
