import { Module } from '@nestjs/common';
import { DynamoModule } from '../../database/dynamo.module';
import { UserRepository } from './infrastructure/repositories/user.repository';

@Module({
    imports: [DynamoModule],
    providers: [UserRepository],
    exports: [UserRepository],
})
export class AuthModule {}
