import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoService {
    public doc: DynamoDBDocumentClient;

    constructor() {
        const client = new DynamoDBClient({
            region: process.env.AWS_REGION || 'us-east-1',
            endpoint: process.env.DYNAMO_ENDPOINT,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fake',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fake',
            },
        });

        this.doc = DynamoDBDocumentClient.from(client);
    }
}
