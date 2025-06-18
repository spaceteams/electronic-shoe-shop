import type {DynamoDBRecord, SQSEvent} from "aws-lambda";
import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export const handler = async (event: SQSEvent): Promise<void> => {
    // Note: This is just a simulation of an API call to the ERP system
    const updateUserInERPSystemRequest = async (user: Record<string, unknown>): Promise<boolean> => {
        console.log(`Updating the user '${user.id}' in ERP system using the ERP API...`);
        console.log('Updated the user successfully!');
        return true;
    };

    for (const record of event.Records) {
        const dynamoDbStreamEvent = JSON.parse(record.body) as DynamoDBRecord

        console.log(`Event: ${dynamoDbStreamEvent}`);

        if (dynamoDbStreamEvent.dynamodb?.NewImage) {
            const updatedUser = unmarshall(dynamoDbStreamEvent.dynamodb?.NewImage as Record<string, AttributeValue>);
            await updateUserInERPSystemRequest(updatedUser);
        }
    }
};
