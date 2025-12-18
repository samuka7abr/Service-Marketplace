export class User {
    uuid: string;
    email: string;
    password: string;
    userName: string;
    type: 'CLIENT' | 'PROVIDER';
    createdAt: Date;
    updatedAt: Date;
}
