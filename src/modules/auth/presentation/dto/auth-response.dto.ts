import { TokenPayload } from '../../domain/interfaces/token-payload.interface';

export class AuthResponseDto {
    accessToken: TokenPayload;
    refreshToken: TokenPayload;
    user: {
        uuid: string;
        email: string;
        userName: string;
        type: 'CLIENT' | 'PROVIDER';
    };
}
