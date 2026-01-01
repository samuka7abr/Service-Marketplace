import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../../domain/interfaces/token.service.interface';
import { Injectable } from '@nestjs/common';
import { TokenPayload } from '../../domain/interfaces/token-payload.interface';

@Injectable()
export class TokenService implements ITokenService {
    constructor(private jwtService: JwtService) {}

    async generateToken(
        payload: object,
        expiresIn?: string | number,
    ): Promise<TokenPayload> {
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: expiresIn || '24h',
        });
        return Promise.resolve({
            ...payload,
            token,
        } as unknown as TokenPayload);
    }

    async verifyToken(token: string): Promise<TokenPayload> {
        try {
            const payload = await this.jwtService.verifyAsync<TokenPayload>(
                token,
                {
                    secret: process.env.JWT_SECRET,
                },
            );
            return payload;
        } catch {
            throw new Error('Invalid or expired token');
        }
    }

    decodeToken(token: string): TokenPayload {
        const decoded = this.jwtService.decode<TokenPayload>(token);
        if (!decoded || typeof decoded === 'string') {
            throw new Error('Invalid token format');
        }
        return decoded;
    }

    async generateRefreshToken(
        payload: object,
        expiresIn?: string | number,
    ): Promise<TokenPayload> {
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
            expiresIn: expiresIn || '7d',
        });
        return Promise.resolve({
            ...payload,
            token,
        } as unknown as TokenPayload);
    }

    async verifyRefreshToken(token: string): Promise<TokenPayload> {
        try {
            const payload = await this.jwtService.verifyAsync<TokenPayload>(
                token,
                {
                    secret:
                        process.env.JWT_REFRESH_SECRET ||
                        process.env.JWT_SECRET,
                },
            );
            return payload;
        } catch {
            throw new Error('Invalid or expired refresh token');
        }
    }
}
