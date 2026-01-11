import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetUserByUsernameUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(userName: string): Promise<User> {
        const user = await this.userRepository.findByUserName(userName);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
