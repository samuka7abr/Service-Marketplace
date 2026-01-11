import { Module } from '@nestjs/common';
import { DynamoModule } from '../../database/dynamo.module';

// Repositories
import { UserRepository } from './infrastructure/repositories/user.repository';

// Use Cases
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email.use-case';
import { GetUserByUsernameUseCase } from './application/use-cases/get-user-by-username.use-case';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';

// Controllers
import { UsersController } from './presentation/controllers/users.controller';

@Module({
    imports: [DynamoModule],
    controllers: [UsersController],
    providers: [
        // Repository
        {
            provide: 'IUserRepository',
            useClass: UserRepository,
        },
        // Use Cases
        CreateUserUseCase,
        GetUserByIdUseCase,
        GetUserByEmailUseCase,
        GetUserByUsernameUseCase,
        GetAllUsersUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
    ],
    exports: [
        'IUserRepository',
        CreateUserUseCase,
        GetUserByIdUseCase,
        GetUserByEmailUseCase,
    ],
})
export class UsersModule {}
