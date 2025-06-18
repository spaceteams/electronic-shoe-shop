import { Construct } from 'constructs'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'

export class Persistence extends Construct {
  productTable: dynamodb.Table
  userTable: dynamodb.Table
  ordersTable: dynamodb.Table

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.productTable = new dynamodb.Table(this, 'ProductTable', {
      tableName: 'products',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
    })

    this.userTable = new dynamodb.Table(this, 'UserTable', {
      tableName: 'users',
      partitionKey: {
        name: 'email',
        type: dynamodb.AttributeType.STRING,
      },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    })

    this.ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      tableName: 'orders',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'email',
        type: dynamodb.AttributeType.STRING,
      },
      stream: dynamodb.StreamViewType.NEW_IMAGE,
    })
  }
}
