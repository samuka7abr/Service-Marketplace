import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetUserByIdUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(uuid: string): Promise<User> {
        const user = await this.userRepository.findById(uuid);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
