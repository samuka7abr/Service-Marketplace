import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoModule } from './database/dynamo.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServicesModule } from './modules/services/services.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DynamoModule,
        UsersModule,
        AuthModule,
        ServicesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
