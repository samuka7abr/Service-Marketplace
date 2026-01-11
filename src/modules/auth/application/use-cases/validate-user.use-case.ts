import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { ITokenService } from '../../domain/interfaces/token.service.interface';
import type { IUserRepository } from '../../../users/domain/interfaces/user.repository.interface';
import { TokenPayload } from '../../domain/interfaces/token-payload.interface';
import { User } from '../../../users/domain/entities/user.entity';

@Injectable()
export class ValidateUserUseCase {
    constructor(
        @Inject('ITokenService')
        private readonly tokenService: ITokenService,
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(token: string): Promise<User> {
        try {
            const payload: TokenPayload =
                await this.tokenService.verifyToken(token);

            const user = await this.userRepository.findById(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            return user;
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
