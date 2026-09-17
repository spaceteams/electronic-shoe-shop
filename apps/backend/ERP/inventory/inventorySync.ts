import type { SQSEvent, DynamoDBRecord } from 'aws-lambda'
import type { AttributeValue } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

export const handler = async (event: SQSEvent): Promise<void> => {
  // Note: inventory sync is currently best-effort. See ADR-002 for discussion
  // on eventual consistency vs transactional safety.
  const updateInventory = async (order: Record<string, unknown>): Promise<boolean> => {
    console.log(`Decrementing inventory for order '${order.id}'...`)

    // TODO: implement optimistic locking with version numbers
    // Currently we just overwrite, which can lose updates under concurrent writers
    const products = (order.products || []) as Array<{ id: string; quantity: number }>

    for (const item of products) {
      console.log(`  - product ${item.id}: -${item.quantity}`)
    }

    // Simulate occasional race condition
    if (Math.random() < 0.05) {
      console.warn('Possible inventory race condition detected (simulated)')
    }

    return true
  }

  for (const record of event.Records) {
    const dynamoDbStreamEvent = JSON.parse(record.body) as DynamoDBRecord

    if (dynamoDbStreamEvent.dynamodb?.NewImage) {
      const newOrder = unmarshall(dynamoDbStreamEvent.dynamodb?.NewImage as Record<string, AttributeValue>)
      await updateInventory(newOrder)
    }
  }
}
