import { Injectable } from '@nestjs/common';
import { IMediaRepository } from '../../domain/interfaces/media.repository.interface';
import { DynamoService } from '../../../../database/dynamo.service';
import { Media } from '../../domain/entities/media.entity';
import {
    GetCommand,
    PutCommand,
    QueryCommand,
    DeleteCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb';

@Injectable()
export class MediaRepository implements IMediaRepository {
    constructor(private dynamoService: DynamoService) {}

    async create(media: Media): Promise<void> {
        await this.dynamoService.doc.send(
            new PutCommand({
                TableName: 'Marketplace',
                Item: {
                    PK: `MEDIA#${media.uuid}`,
                    SK: 'META',

                    // GSI1 para buscar por usuário
                    GSI1PK: `USER#${media.userId}`,
                    GSI1SK: `MEDIA#${media.createdAt.toISOString()}`,

                    // GSI2 para buscar por request (se existir)
                    GSI2PK: media.requestId ? `REQUEST#${media.requestId}` : undefined,
                    GSI2SK: media.requestId ? `MEDIA#${media.uuid}` : undefined,

                    uuid: media.uuid,
                    userId: media.userId,
                    requestId: media.requestId,
                    s3Key: media.s3Key,
                    s3Bucket: media.s3Bucket,
                    filename: media.filename,
                    originalFilename: media.originalFilename,
                    size: media.size,
                    mimeType: media.mimeType,
                    fileHash: media.fileHash,
                    thumbnailS3Key: media.thumbnailS3Key,
                    createdAt: media.createdAt.toISOString(),
                    updatedAt: media.updatedAt.toISOString(),
                    entityType: 'MEDIA',
                },
                ConditionExpression: 'attribute_not_exists(PK)',
            }),
        );
    }

    async findById(uuid: string): Promise<Media | null> {
        const result = await this.dynamoService.doc.send(
            new GetCommand({
                TableName: 'Marketplace',
                Key: {
                    PK: `MEDIA#${uuid}`,
                    SK: 'META',
                },
            }),
        );

        if (!result.Item) return null;

        return this.mapToEntity(result.Item);
    }

    async findByUserId(
        userId: string,
        limit: number = 20,
        lastKey?: string,
    ): Promise<{ items: Media[]; lastKey?: string }> {
        const params: any = {
            TableName: 'Marketplace',
            IndexName: 'GSI1',
            KeyConditionExpression: 'GSI1PK = :pk',
            ExpressionAttributeValues: {
                ':pk': `USER#${userId}`,
            },
            Limit: limit,
            ScanIndexForward: false, // Ordenar por data decrescente
        };

        if (lastKey) {
            params.ExclusiveStartKey = JSON.parse(
                Buffer.from(lastKey, 'base64').toString(),
            );
        }

        const response = await this.dynamoService.doc.send(
            new QueryCommand(params),
        );

        const items =
            response.Items?.filter((item) => item.entityType === 'MEDIA').map(
                (item) => this.mapToEntity(item),
            ) || [];

        const nextLastKey = response.LastEvaluatedKey
            ? Buffer.from(JSON.stringify(response.LastEvaluatedKey)).toString(
                  'base64',
              )
            : undefined;

        return { items, lastKey: nextLastKey };
    }

    async findByRequestId(requestId: string): Promise<Media[]> {
        const response = await this.dynamoService.doc.send(
            new QueryCommand({
                TableName: 'Marketplace',
                IndexName: 'GSI2',
                KeyConditionExpression: 'GSI2PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': `REQUEST#${requestId}`,
                },
            }),
        );

        if (!response.Items || response.Items.length === 0) return [];

        return response.Items.filter((item) => item.entityType === 'MEDIA').map(
            (item) => this.mapToEntity(item),
        );
    }

    async delete(uuid: string): Promise<void> {
        await this.dynamoService.doc.send(
            new DeleteCommand({
                TableName: 'Marketplace',
                Key: {
                    PK: `MEDIA#${uuid}`,
                    SK: 'META',
                },
            }),
        );
    }

    async countByUserId(userId: string): Promise<number> {
        const response = await this.dynamoService.doc.send(
            new QueryCommand({
                TableName: 'Marketplace',
                IndexName: 'GSI1',
                KeyConditionExpression: 'GSI1PK = :pk',
                ExpressionAttributeValues: {
                    ':pk': `USER#${userId}`,
                },
                Select: 'COUNT',
            }),
        );

        return response.Count || 0;
    }

    private mapToEntity(item: Record<string, any>): Media {
        return new Media(
            item.uuid as string,
            item.userId as string,
            item.requestId as string | null,
            item.s3Key as string,
            item.s3Bucket as string,
            item.filename as string,
            item.originalFilename as string,
            item.size as number,
            item.mimeType as string,
            item.fileHash as string,
            item.thumbnailS3Key as string | null,
            new Date(item.createdAt as string),
            new Date(item.updatedAt as string),
        );
    }
}
