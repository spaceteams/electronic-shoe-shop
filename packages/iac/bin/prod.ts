#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { ProdStack } from '../lib/prod-stack'

const app = new cdk.App()
new ProdStack(app, 'ProdStack', {
  env: { account: '164612576293', region: 'eu-central-1' },
})
