import { Injectable } from '@nestjs/common';
import { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { DynamoService } from '../../../../database/dynamo.service';
import { Service } from '../../domain/entities/service.entity';
import {
    GetCommand,
    PutCommand,
    QueryCommand,
    DeleteCommand,
    UpdateCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class ServiceRepository implements IServiceRepository {
    constructor(private dynamoService: DynamoService) {}

    async create(service: Service): Promise<void> {
        await this.dynamoService.doc.send(
            new PutCommand({
                TableName: 'Marketplace',
                Item: {
                    PK: `SERVICE#${service.uuid}`,
                    SK: 'META',

                    // GSI1 para buscar por categoria
                    GSI1PK: `CATEGORY#${service.category}`,
                    GSI1SK: `SERVICE#${service.uuid}`,

                    // GSI2 para buscar por nome (unicidade)
                    GSI2PK: `SERVICENAME#${service.name.toUpperCase()}`,

                    uuid: service.uuid,
                    name: service.name,
                    description: service.description,
                    category: service.category,
                    isActive: service.isActive,
                    createdAt: service.createdAt.toISOString(),
                    updatedAt: service.updatedAt.toISOString(),
                },
                ConditionExpression: 'attribute_not_exists(PK)',
            }),
        );
    }

    async findById(uuid: string): Promise<Service | null> {
        const result = await this.dynamoService.doc.send(
            new GetCommand({
                TableName: 'Marketplace',
                Key: {
                    PK: `SERVICE#${uuid}`,
                    SK: 'META',
                },
            }),
        );

        if (!result.Item) return null;

        return this.mapToEntity(result.Item);
    }

    async findByName(name: string): Promise<Service | null> {
        const response = await this.dynamoService.doc.send(
            new QueryCommand({
                TableName: 'Marketplace',
                IndexName: 'GSI2',
                KeyConditionExpression: 'GSI2PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': `SERVICENAME#${name.toUpperCase()}`,
                },
                Limit: 1,
            }),
        );

        if (!response.Items || response.Items.length === 0) return null;

        return this.mapToEntity(response.Items[0]);
    }

    async findByCategory(category: string): Promise<Service[]> {
        const response = await this.dynamoService.doc.send(
            new QueryCommand({
                TableName: 'Marketplace',
                IndexName: 'GSI1',
                KeyConditionExpression: 'GSI1PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': `CATEGORY#${category}`,
                },
            }),
        );

        if (!response.Items || response.Items.length === 0) return [];

        return response.Items.map((item) => this.mapToEntity(item));
    }

    async findAll(): Promise<Service[]> {
        const response = await this.dynamoService.doc.send(
            new ScanCommand({
                TableName: 'Marketplace',
                FilterExpression: 'begins_with(PK, :pk) AND SK = :sk',
                ExpressionAttributeValues: {
                    ':pk': 'SERVICE#',
                    ':sk': 'META',
                },
            }),
        );

        if (!response.Items || response.Items.length === 0) return [];

        return response.Items.map((item) => this.mapToEntity(item));
    }

    async findAllActive(): Promise<Service[]> {
        const response = await this.dynamoService.doc.send(
            new ScanCommand({
                TableName: 'Marketplace',
                FilterExpression:
                    'begins_with(PK, :pk) AND SK = :sk AND isActive = :active',
                ExpressionAttributeValues: {
                    ':pk': 'SERVICE#',
                    ':sk': 'META',
                    ':active': true,
                },
            }),
        );

        if (!response.Items || response.Items.length === 0) return [];

        return response.Items.map((item) => this.mapToEntity(item));
    }

    async update(service: Service): Promise<void> {
        await this.dynamoService.doc.send(
            new UpdateCommand({
                TableName: 'Marketplace',
                Key: {
                    PK: `SERVICE#${service.uuid}`,
                    SK: 'META',
                },
                UpdateExpression:
                    'SET #name = :name, description = :description, category = :category, isActive = :isActive, updatedAt = :updatedAt, GSI1PK = :gsi1pk, GSI2PK = :gsi2pk',
                ExpressionAttributeValues: {
                    ':name': service.name,
                    ':description': service.description,
                    ':category': service.category,
                    ':isActive': service.isActive,
                    ':updatedAt': service.updatedAt.toISOString(),
                    ':gsi1pk': `CATEGORY#${service.category}`,
                    ':gsi2pk': `SERVICENAME#${service.name.toUpperCase()}`,
                },
                ExpressionAttributeNames: {
                    '#name': 'name',
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
                    PK: `SERVICE#${uuid}`,
                    SK: 'META',
                },
            }),
        );
    }

    private mapToEntity(item: Record<string, any>): Service {
        return new Service(
            item.uuid as string,
            item.name as string,
            item.description as string,
            item.category as string,
            item.isActive as boolean,
            new Date(item.createdAt as string),
            new Date(item.updatedAt as string),
        );
    }
}