import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case';
import { GetUserByEmailUseCase } from '../../application/use-cases/get-user-by-email.use-case';
import { GetUserByUsernameUseCase } from '../../application/use-cases/get-user-by-username.use-case';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getUserByIdUseCase: GetUserByIdUseCase,
        private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
        private readonly getUserByUsernameUseCase: GetUserByUsernameUseCase,
        private readonly getAllUsersUseCase: GetAllUsersUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.createUserUseCase.execute(createUserDto);
        return UserResponseDto.fromEntity(user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.getAllUsersUseCase.execute();
        return UserResponseDto.fromEntities(users);
    }

    @Get(':uuid')
    @HttpCode(HttpStatus.OK)
    async findById(@Param('uuid') uuid: string): Promise<UserResponseDto> {
        const user = await this.getUserByIdUseCase.execute(uuid);
        return UserResponseDto.fromEntity(user);
    }

    @Get('email/:email')
    @HttpCode(HttpStatus.OK)
    async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
        const user = await this.getUserByEmailUseCase.execute(email);
        return UserResponseDto.fromEntity(user);
    }

    @Get('username/:userName')
    @HttpCode(HttpStatus.OK)
    async findByUsername(@Param('userName') userName: string): Promise<UserResponseDto> {
        const user = await this.getUserByUsernameUseCase.execute(userName);
        return UserResponseDto.fromEntity(user);
    }

    @Put(':uuid')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param('uuid') uuid: string,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        const user = await this.updateUserUseCase.execute(uuid, updateUserDto);
        return UserResponseDto.fromEntity(user);
    }

    @Delete(':uuid')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('uuid') uuid: string): Promise<void> {
        await this.deleteUserUseCase.execute(uuid);
    }
}
