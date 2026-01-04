import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
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

// Strategies & Guards
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';

@Module({
    imports: [
        DynamoModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): JwtModuleOptions => {
                const expiresIn = configService.get<string>('JWT_EXPIRES_IN') ?? '15m';
                return {
                    secret: configService.getOrThrow<string>('JWT_SECRET'),
                    signOptions: { expiresIn } as JwtModuleOptions['signOptions'],
                };
            },
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
        // Strategies & Guards
        JwtStrategy,
        JwtAuthGuard,
    ],
    exports: [
        'IUserRepository',
        'ITokenService',
        RegisterUserUseCase,
        LoginUseCase,
        RefreshTokenUseCase,
        ValidateUserUseCase,
        JwtAuthGuard,
    ],
})
export class AuthModule { }
