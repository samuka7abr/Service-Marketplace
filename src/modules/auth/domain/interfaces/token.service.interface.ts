export interface ITokenService {
    generateToken(
        payload: object,
        expiresIn?: string | number,
    ): Promise<string>;
    verifyToken(token: string): Promise<object | string>;
    decodeToken(token: string): object | string;
    generateRefreshToken(
        payload: object,
        expiresIn?: string | number,
    ): Promise<string>;
    verifyRefreshToken(token: string): Promise<object | string>;
}
