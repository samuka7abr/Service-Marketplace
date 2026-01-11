import { Injectable, ConflictException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../users/domain/interfaces/user.repository.interface';
import { User } from '../../../users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class RegisterUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(data: {
        email: string;
        password: string;
        userName: string;
        type: 'CLIENT' | 'PROVIDER';
    }): Promise<User> {
        const existingEmail = await this.userRepository.findByEmail(data.email);
        if (existingEmail) {
            throw new ConflictException('Email already in use');
        }

        const existingUserName = await this.userRepository.findByUserName(
            data.userName,
        );
        if (existingUserName) {
            throw new ConflictException('Username already in use');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = new User(
            randomUUID(),
            data.email,
            hashedPassword,
            data.userName,
            data.type,
            new Date(),
            new Date(),
        );

        await this.userRepository.create(user);

        return user;
    }
}
