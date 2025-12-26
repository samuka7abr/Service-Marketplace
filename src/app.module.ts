import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoModule } from './database/dynamo.module';

@Module({
    imports: [DynamoModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
