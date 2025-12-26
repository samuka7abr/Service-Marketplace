import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
    credentials: {
        accessKeyId: 'fake',
        secretAccessKey: 'fake',
    },
});

async function createMarketplaceTable() {
    const command = new CreateTableCommand({
        TableName: 'Marketplace',
        AttributeDefinitions: [
            { AttributeName: 'PK', AttributeType: 'S' },
            { AttributeName: 'SK', AttributeType: 'S' },
            { AttributeName: 'GSI1PK', AttributeType: 'S' },
            { AttributeName: 'GSI1SK', AttributeType: 'S' },
        ],
        KeySchema: [
            { AttributeName: 'PK', KeyType: 'HASH' },
            { AttributeName: 'SK', KeyType: 'RANGE' },
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'GSI1',
                KeySchema: [
                    { AttributeName: 'GSI1PK', KeyType: 'HASH' },
                    { AttributeName: 'GSI1SK', KeyType: 'RANGE' },
                ],
                Projection: { ProjectionType: 'ALL' },
            },
        ],
        BillingMode: 'PAY_PER_REQUEST',
    });

    try {
        await client.send(command);
        console.log('Marketplace table created successfully.');
    } catch (err) {
        console.error('Error creating Marketplace table:', err);
    }
}

createMarketplaceTable();
