import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(
        uuid: string,
        data: {
            email?: string;
            password?: string;
            userName?: string;
            type?: 'CLIENT' | 'PROVIDER';
        },
    ): Promise<User> {
        const user = await this.userRepository.findById(uuid);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (data.email && data.email !== user.email) {
            const existingEmail = await this.userRepository.findByEmail(data.email);
            if (existingEmail) {
                throw new ConflictException('Email already in use');
            }
            user.email = data.email;
        }

        if (data.userName && data.userName !== user.userName) {
            const existingUserName = await this.userRepository.findByUserName(
                data.userName,
            );
            if (existingUserName) {
                throw new ConflictException('Username already in use');
            }
            user.userName = data.userName;
        }

        if (data.password) {
            user.password = await bcrypt.hash(data.password, 10);
        }

        if (data.type) {
            user.type = data.type;
        }

        user.updatedAt = new Date();

        await this.userRepository.update(user);

        return user;
    }
}
