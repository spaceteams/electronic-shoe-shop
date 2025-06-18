import type { SQSEvent, DynamoDBRecord } from "aws-lambda";
import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const handler = async (event: SQSEvent): Promise<void> => {
    // Note: This is just a simulation of an API call to the ERP system
    const createOrderInERPSystemRequest = async (order: Record<string, unknown>): Promise<boolean> => {
        console.log(`Create a new order '${order.id}' in ERP system using the ERP API...`);

        if (Math.random() < 0.34) {
            console.log("Creating the order in ERP system failed!");
            return false;
        }

        console.log("Created the order successfully!");

        return true;
    };

    for (const record of event.Records) {
        const dynamoDbStreamEvent = JSON.parse(record.body) as DynamoDBRecord

        if (dynamoDbStreamEvent.dynamodb?.NewImage) {
            const newOrder = unmarshall(dynamoDbStreamEvent.dynamodb?.NewImage as Record<string, AttributeValue>);
            await createOrderInERPSystemRequest(newOrder);
        }
    }
};
