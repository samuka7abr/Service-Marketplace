import { JwtSignOptions } from '@nestjs/jwt';
import { TokenPayload } from './token-payload.interface';

export interface ITokenService {
    generateToken(
        payload: object,
        expiresIn?: JwtSignOptions['expiresIn'],
    ): Promise<TokenPayload>;
    verifyToken(token: string): Promise<TokenPayload>;
    decodeToken(token: string): TokenPayload;
    generateRefreshToken(
        payload: object,
        expiresIn?: JwtSignOptions['expiresIn'],
    ): Promise<TokenPayload>;
    verifyRefreshToken(token: string): Promise<TokenPayload>;
}
