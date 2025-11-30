import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoService {
  public doc: DynamoDBDocumentClient;

  constructor() {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
      endpoint: process.env.DYNAMO_ENDPOINT,
    });

    this.doc = DynamoDBDocumentClient.from(client);
  }
}
