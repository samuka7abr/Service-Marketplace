export interface TokenPayload {
    sub: string;
    email: string;
    role: 'CLIENT' | 'PROVIDER';
    [key: string]: any;
}
