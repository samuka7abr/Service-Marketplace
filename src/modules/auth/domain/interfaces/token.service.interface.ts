import { TokenPayload } from './token-payload.interface';

export interface ITokenService {
    generateToken(
        payload: object,
        expiresIn?: string | number,
    ): Promise<TokenPayload>;
    verifyToken(token: string): Promise<TokenPayload>;
    decodeToken(token: string): TokenPayload;
    generateRefreshToken(
        payload: object,
        expiresIn?: string | number,
    ): Promise<TokenPayload>;
    verifyRefreshToken(token: string): Promise<TokenPayload>;
}
