import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

export const dynamoClient = new DynamoDBClient({
  region: 'eu-central-1',
})

export const documentClient = DynamoDBDocument.from(dynamoClient)
