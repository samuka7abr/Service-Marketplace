import { Injectable } from '@nestjs/common';
import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { DynamoService } from '../../../../database/dynamo.service';
import { Request, RequestStatus } from '../../domain/entities/request.entity';
import {
    GetCommand,
    PutCommand,
    QueryCommand,
    DeleteCommand,
    UpdateCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class RequestRepository implements IRequestRepository {
    constructor(private dynamoService: DynamoService) {}

    async create(request: Request): Promise<void> {
        await this.dynamoService.doc.send(
            new PutCommand({
                TableName: 'Marketplace',
                Item: {
                    PK: `REQUEST#${request.uuid}`,
                    SK: 'META',

                    // GSI1 para buscar por cliente
                    GSI1PK: `CLIENT#${request.clientId}`,
                    GSI1SK: `REQUEST#${request.uuid}`,

                    // GSI2 para buscar por serviço
                    GSI2PK: `SERVICE#${request.serviceId}`,
                    GSI2SK: `REQUEST#${request.uuid}`,

                    uuid: request.uuid,
                    clientId: request.clientId,
                    serviceId: request.serviceId,
                    title: request.title,
                    description: request.description,
                    budget: request.budget,
                    location: request.location,
                    status: request.status,
                    createdAt: request.createdAt.toISOString(),
                    updatedAt: request.updatedAt.toISOString(),
                    entityType: 'REQUEST',
                },
                ConditionExpression: 'attribute_not_exists(PK)',
            }),
        );
    }

    async findById(uuid: string): Promise<Request | null> {
        const result = await this.dynamoService.doc.send(
            new GetCommand({
                TableName: 'Marketplace',
                Key: {
                    PK: `REQUEST#${uuid}`,
                    SK: 'META',
                },
            }),
        );

        if (!result.Item) return null;

        return this.mapToEntity(result.Item);
    }

    async findByClientId(clientId: string): Promise<Request[]> {
        const response = await this.dynamoService.doc.send(
            new QueryCommand({
                TableName: 'Marketplace',
                IndexName: 'GSI1',
                KeyConditionExpression: 'GSI1PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': `CLIENT#${clientId}`,
                },
            }),
        );

        if (!response.Items || response.Items.length === 0) return [];

        return response.Items.filter((item) => item.entityType === 'REQUEST').map(
            (item) => this.mapToEntity(item),
        );
    }

    async findByServiceId(serviceId: string): Promise<Request[]> {
        const response = await this.dynamoService.doc.send(
            new QueryCommand({
                TableName: 'Marketplace',
                IndexName: 'GSI2',
                KeyConditionExpression: 'GSI2PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': `SERVICE#${serviceId}`,
                },
            }),
        );

        if (!response.Items || response.Items.length === 0) return [];

        return response.Items.filter((item) => item.entityType === 'REQUEST').map(
            (item) => this.mapToEntity(item),
        );
    }

    async findByStatus(status: string): Promise<Request[]> {
        const response = await this.dynamoService.doc.send(
            new ScanCommand({
                TableName: 'Marketplace',
                FilterExpression:
                    'begins_with(PK, :pk) AND SK = :sk AND #status = :status',
                ExpressionAttributeValues: {
                    ':pk': 'REQUEST#',
                    ':sk': 'META',
                    ':status': status,
                },
                ExpressionAttributeNames: {
                    '#status': 'status',
                },
            }),
        );

        if (!response.Items || response.Items.length === 0) return [];

        return response.Items.map((item) => this.mapToEntity(item));
    }

    async findAll(): Promise<Request[]> {
        const response = await this.dynamoService.doc.send(
            new ScanCommand({
                TableName: 'Marketplace',
                FilterExpression: 'begins_with(PK, :pk) AND SK = :sk',
                ExpressionAttributeValues: {
                    ':pk': 'REQUEST#',
                    ':sk': 'META',
                },
            }),
        );

        if (!response.Items || response.Items.length === 0) return [];

        return response.Items.map((item) => this.mapToEntity(item));
    }

    async update(request: Request): Promise<void> {
        await this.dynamoService.doc.send(
            new UpdateCommand({
                TableName: 'Marketplace',
                Key: {
                    PK: `REQUEST#${request.uuid}`,
                    SK: 'META',
                },
                UpdateExpression:
                    'SET title = :title, description = :description, budget = :budget, #location = :location, #status = :status, updatedAt = :updatedAt, GSI2PK = :gsi2pk',
                ExpressionAttributeValues: {
                    ':title': request.title,
                    ':description': request.description,
                    ':budget': request.budget,
                    ':location': request.location,
                    ':status': request.status,
                    ':updatedAt': request.updatedAt.toISOString(),
                    ':gsi2pk': `SERVICE#${request.serviceId}`,
                },
                ExpressionAttributeNames: {
                    '#location': 'location',
                    '#status': 'status',
                },
                ConditionExpression: 'attribute_exists(PK)',
            }),
        );
    }

    async delete(uuid: string): Promise<void> {
        await this.dynamoService.doc.send(
            new DeleteCommand({
                TableName: 'Marketplace',
                Key: {
                    PK: `REQUEST#${uuid}`,
                    SK: 'META',
                },
            }),
        );
    }

    private mapToEntity(item: Record<string, any>): Request {
        return new Request(
            item.uuid as string,
            item.clientId as string,
            item.serviceId as string,
            item.title as string,
            item.description as string,
            item.budget as number,
            item.location as string,
            item.status as RequestStatus,
            new Date(item.createdAt as string),
            new Date(item.updatedAt as string),
        );
    }
}
