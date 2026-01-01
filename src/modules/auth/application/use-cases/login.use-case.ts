import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import type { ITokenService } from '../../domain/interfaces/token.service.interface';
import { TokenPayload } from '../../domain/interfaces/token-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        @Inject('ITokenService')
        private readonly tokenService: ITokenService,
    ) {}

    async execute(data: { email: string; password: string }): Promise<{
        accessToken: TokenPayload;
        refreshToken: TokenPayload;
        user: {
            uuid: string;
            email: string;
            userName: string;
            type: 'CLIENT' | 'PROVIDER';
        };
    }> {
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password,
        );
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.uuid,
            email: user.email,
            role: user.type,
        };

        const accessToken = await this.tokenService.generateToken(payload);
        const refreshToken =
            await this.tokenService.generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
            user: {
                uuid: user.uuid,
                email: user.email,
                userName: user.userName,
                type: user.type,
            },
        };
    }
}
