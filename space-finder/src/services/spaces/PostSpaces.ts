import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { hasAdminGroup } from "../../infra/utils";

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if (!hasAdminGroup(event)) {
        return {
            statusCode: 401,
            body: JSON.stringify(`Not authorized!`)
        }
    }

    const randomId = v4();
    const item = JSON.parse(event?.body ? event?.body: "");
    const result = await ddbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
            id: {
                S: randomId
            },
            location: {
                S: item.location
            }
        }
    }));
    console.log(result);
    return {
        statusCode: 201,
        body: JSON.stringify({id: randomId})
    }
}
