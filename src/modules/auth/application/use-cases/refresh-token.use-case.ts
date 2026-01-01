import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import type { ITokenService } from '../../domain/interfaces/token.service.interface';
import { TokenPayload } from '../../domain/interfaces/token-payload.interface';

@Injectable()
export class RefreshTokenUseCase {
    constructor(
        @Inject('ITokenService')
        private readonly tokenService: ITokenService,
    ) {}

    async execute(refreshToken: string): Promise<{
        accessToken: TokenPayload;
        refreshToken: TokenPayload;
    }> {
        try {
            const payload =
                await this.tokenService.verifyRefreshToken(refreshToken);

            const newPayload = {
                sub: payload.sub,
                email: payload.email,
                role: payload.role,
            };

            const newAccessToken =
                await this.tokenService.generateToken(newPayload);
            const newRefreshToken =
                await this.tokenService.generateRefreshToken(newPayload);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
