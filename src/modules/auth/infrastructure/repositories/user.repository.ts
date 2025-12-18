import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { DynamoService } from '../../../../database/dynamo.service';
import { User } from '../../domain/entities/user.entity';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(private dynamoService: DynamoService) {}

    async create(user: User): Promise<void> {
        await this.dynamoService.doc.send(
            new PutCommand({
                TableName: 'Marketplace',
                Item: {
                    PK: `USER#${user.uuid}`,
                    SK: 'META',

                    GSI1PK: `EMAIL#${user.email}`,
                    GSI1SK: `USER#${user.uuid}`,

                    uuid: user.uuid,
                    email: user.email,
                    password: user.password,
                    userName: user.userName,
                    type: user.type,
                    createdAt: user.createdAt.toISOString(),
                    updatedAt: user.updatedAt.toISOString(),
                },
                ConditionExpression: 'attribute_not_exists(PK)',
            }),
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const response = await this.dynamoService.doc.send(
            new QueryCommand({
                TableName: 'Marketplace',
                IndexName: 'GSI1',
                KeyConditionExpression: 'GSI1PK = :email',
                ExpressionAttributeValues: {
                    ':email': `EMAIL#${email}`,
                },
                Limit: 1,
            }),
        );

        if (response.Items && response.Items.length > 0) {
            const item = response.Items[0];
            return new User(
                item.uuid as string,
                item.email as string,
                item.password as string,
                item.userName as string,
                item.type as 'CLIENT' | 'PROVIDER',
                new Date(item.createdAt as string),
                new Date(item.updatedAt as string),
            );
        }

        return null;
    }

    async findByUserName(userName: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }

    async findById(id: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }

    async update(user: User): Promise<void> {
        throw new Error('Method not implemented.');
    }

    async delete(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
