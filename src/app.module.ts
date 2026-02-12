import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoModule } from './database/dynamo.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServicesModule } from './modules/services/services.module';
import { RequestsModule } from './modules/requests/requests.module';
import { ProposalsModule } from './modules/proposals/proposals.module';
import { MediaModule } from './modules/media/media.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DynamoModule,
        UsersModule,
        AuthModule,
        ServicesModule,
        RequestsModule,
        ProposalsModule,
        MediaModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
