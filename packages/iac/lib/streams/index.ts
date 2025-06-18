import { Construct } from 'constructs'
import { join } from 'node:path'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as pipes from 'aws-cdk-lib/aws-pipes'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import type * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import type { Persistence } from '../persistence'

export class Streams extends Construct {
  constructor(scope: Construct, id: string, tables: Persistence) {
    super(scope, id)

    this.createUserStream(this, tables.userTable)
    this.createOrderStream(this, tables.ordersTable)
  }

  private createUserStream = (scope: Construct, table: dynamodb.Table) => {
    if (!table.tableStreamArn) {
      return
    }

    const queue = new sqs.Queue(this, 'UpdatedUserQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
    })

    const updateUserFunction = new NodejsFunction(this, 'UpdateUserFunction', {
      entry: join(__dirname, '../../../../apps/backend/ERP/user/updateUser.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(60),
      bundling: {
        sourceMap: true,
        target: 'es2020',
        externalModules: ['@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb'],
      },
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    })

    const pipesRole = new iam.Role(this, 'UserStreamPipesExecutionRole', {
      assumedBy: new iam.ServicePrincipal('pipes.amazonaws.com'),
      inlinePolicies: {
        PipesExecutionPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'dynamodb:DescribeStream',
                'dynamodb:GetRecords',
                'dynamodb:GetShardIterator',
                'dynamodb:ListStreams',
              ],
              resources: [table.tableStreamArn],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['sqs:SendMessage', 'sqs:GetQueueUrl', 'sqs:GetQueueAttributes'],
              resources: [queue.queueArn],
            }),
          ],
        }),
      },
    })

    new pipes.CfnPipe(this, 'UpdatedUsersToSqsPipe', {
      roleArn: pipesRole.roleArn,
      source: table.tableStreamArn,
      target: queue.queueArn,
      sourceParameters: {
        dynamoDbStreamParameters: {
          startingPosition: 'LATEST',
          batchSize: 10,
          maximumBatchingWindowInSeconds: 5,
          parallelizationFactor: 1,
        },
      },
    })

    new lambda.EventSourceMapping(this, 'UpdateUserSqsEventSourceMapping', {
      target: updateUserFunction,
      eventSourceArn: queue.queueArn,
      batchSize: 1,
    })

    queue.grantConsumeMessages(updateUserFunction)
  }

  private createOrderStream = (scope: Construct, table: dynamodb.Table) => {
    if (!table.tableStreamArn) {
      return
    }

    const queue = new sqs.Queue(this, 'NewOrderQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
    })

    const newOrderFunction = new NodejsFunction(this, 'CreateOrderFunction', {
      entry: join(__dirname, '../../../../apps/backend/ERP/order/createOrder.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.seconds(60),
      bundling: {
        sourceMap: true,
        target: 'es2020',
        externalModules: ['@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb'],
      },
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
    })

    const pipesRole = new iam.Role(this, 'OrderStreamPipesExecutionRole', {
      assumedBy: new iam.ServicePrincipal('pipes.amazonaws.com'),
      inlinePolicies: {
        PipesExecutionPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'dynamodb:DescribeStream',
                'dynamodb:GetRecords',
                'dynamodb:GetShardIterator',
                'dynamodb:ListStreams',
              ],
              resources: [table.tableStreamArn],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['sqs:SendMessage', 'sqs:GetQueueUrl', 'sqs:GetQueueAttributes'],
              resources: [queue.queueArn],
            }),
          ],
        }),
      },
    })

    new pipes.CfnPipe(this, 'NewOrderToSqsPipe', {
      roleArn: pipesRole.roleArn,
      source: table.tableStreamArn,
      target: queue.queueArn,
      sourceParameters: {
        dynamoDbStreamParameters: {
          startingPosition: 'LATEST',
          batchSize: 10,
          maximumBatchingWindowInSeconds: 5,
          parallelizationFactor: 1,
        },
      },
    })

    new lambda.EventSourceMapping(this, 'NewOrderSqsEventSourceMapping', {
      target: newOrderFunction,
      eventSourceArn: queue.queueArn,
      batchSize: 1,
    })

    queue.grantConsumeMessages(newOrderFunction)
  }
}
