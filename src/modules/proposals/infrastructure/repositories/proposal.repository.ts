import { Injectable } from '@nestjs/common';
import { IProposalRepository } from '../../domain/interfaces/proposal.repository.interface';
import { DynamoService } from '../../../../database/dynamo.service';
import { Proposal, ProposalStatus } from '../../domain/entities/proposal.entity';
import {
    GetCommand,
    PutCommand,
    QueryCommand,
    DeleteCommand,
    UpdateCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class ProposalRepository implements IProposalRepository {
    constructor(private dynamoService: DynamoService) {}

    async create(proposal: Proposal): Promise<void> {
        await this.dynamoService.doc.send(
            new PutCommand({
                TableName: 'Marketplace',
                Item: {
                    PK: `PROPOSAL#${proposal.uuid}`,
                    SK: 'META',

                    // GSI1 para buscar por request
                    GSI1PK: `REQUEST#${proposal.requestId}`,
                    GSI1SK: `PROPOSAL#${proposal.uuid}`,

                    // GSI2 para buscar por provider
                    GSI2PK: `PROVIDER#${proposal.providerId}`,
                    GSI2SK: `PROPOSAL#${proposal.uuid}`,

                    uuid: proposal.uuid,
                    requestId: proposal.requestId,
                    providerId: proposal.providerId,
                    amount: proposal.amount,
                    deliveryTime: proposal.deliveryTime,
                    description: proposal.description,
                    status: proposal.status,
                    createdAt: proposal.createdAt.toISOString(),
                    updatedAt: proposal.updatedAt.toISOString(),
                    entityType: 'PROPOSAL',
                },
                ConditionExpression: 'attribute_not_exists(PK)',
            }),
        );
    }

    async findById(uuid: string): Promise<Proposal | null> {
        const result = await this.dynamoService.doc.send(
            new GetCommand({
                TableName: 'Marketplace',
                Key: {
                    PK: `PROPOSAL#${uuid}`,
                    SK: 'META',
                },
            }),
        );

        if (!result.Item) return null;

        return this.mapToEntity(result.Item);
    }

    async findByRequestId(requestId: string): Promise<Proposal[]> {
        const response = await this.dynamoService.doc.send(
            new QueryCommand({
                TableName: 'Marketplace',
                IndexName: 'GSI1',
                KeyConditionExpression: 'GSI1PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': `REQUEST#${requestId}`,
                },
            }),
        );

        if (!response.Items || response.Items.length === 0) return [];

        return response.Items.filter((item) => item.entityType === 'PROPOSAL').map(
            (item) => this.mapToEntity(item),
        );
    }

    async findByProviderId(providerId: string): Promise<Proposal[]> {
        const response = await this.dynamoService.doc.send(
            new QueryCommand({
                TableName: 'Marketplace',
                IndexName: 'GSI2',
                KeyConditionExpression: 'GSI2PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': `PROVIDER#${providerId}`,
                },
            }),
        );

        if (!response.Items || response.Items.length === 0) return [];

        return response.Items.filter((item) => item.entityType === 'PROPOSAL').map(
            (item) => this.mapToEntity(item),
        );
    }

    async findByStatus(status: string): Promise<Proposal[]> {
        const response = await this.dynamoService.doc.send(
            new ScanCommand({
                TableName: 'Marketplace',
                FilterExpression:
                    'begins_with(PK, :pk) AND SK = :sk AND #status = :status',
                ExpressionAttributeValues: {
                    ':pk': 'PROPOSAL#',
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

    async findAll(): Promise<Proposal[]> {
        const response = await this.dynamoService.doc.send(
            new ScanCommand({
                TableName: 'Marketplace',
                FilterExpression: 'begins_with(PK, :pk) AND SK = :sk',
                ExpressionAttributeValues: {
                    ':pk': 'PROPOSAL#',
                    ':sk': 'META',
                },
            }),
        );

        if (!response.Items || response.Items.length === 0) return [];

        return response.Items.map((item) => this.mapToEntity(item));
    }

    async update(proposal: Proposal): Promise<void> {
        await this.dynamoService.doc.send(
            new UpdateCommand({
                TableName: 'Marketplace',
                Key: {
                    PK: `PROPOSAL#${proposal.uuid}`,
                    SK: 'META',
                },
                UpdateExpression:
                    'SET amount = :amount, deliveryTime = :deliveryTime, description = :description, #status = :status, updatedAt = :updatedAt',
                ExpressionAttributeValues: {
                    ':amount': proposal.amount,
                    ':deliveryTime': proposal.deliveryTime,
                    ':description': proposal.description,
                    ':status': proposal.status,
                    ':updatedAt': proposal.updatedAt.toISOString(),
                },
                ExpressionAttributeNames: {
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
                    PK: `PROPOSAL#${uuid}`,
                    SK: 'META',
                },
            }),
        );
    }

    private mapToEntity(item: Record<string, any>): Proposal {
        return new Proposal(
            item.uuid as string,
            item.requestId as string,
            item.providerId as string,
            item.amount as number,
            item.deliveryTime as number,
            item.description as string,
            item.status as ProposalStatus,
            new Date(item.createdAt as string),
            new Date(item.updatedAt as string),
        );
    }
}
