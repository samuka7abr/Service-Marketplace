import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamoModule } from '../../database/dynamo.module';

// Repositories
import { UserRepository } from './infrastructure/repositories/user.repository';

// Services
import { TokenService } from './infrastructure/services/token.service';

// Use Cases
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { ValidateUserUseCase } from './application/use-cases/validate-user.use-case';

// Controllers
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
    imports: [
        DynamoModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [
        // Repositories
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
        // Services
        {
            provide: 'ITokenService',
            useClass: TokenService,
        },
        // Use Cases
        RegisterUserUseCase,
        LoginUseCase,
        RefreshTokenUseCase,
        ValidateUserUseCase,
    ],
    exports: [
        'IUserRepository',
        'ITokenService',
        RegisterUserUseCase,
        LoginUseCase,
        RefreshTokenUseCase,
        ValidateUserUseCase,
    ],
})
export class AuthModule { }
