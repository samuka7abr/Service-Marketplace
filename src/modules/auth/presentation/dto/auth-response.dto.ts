export class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        uuid: string;
        email: string;
        userName: string;
        type: 'CLIENT' | 'PROVIDER';
    };
}
