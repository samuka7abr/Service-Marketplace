import { User } from '../../domain/entities/user.entity';

export class UserResponseDto {
    uuid: string;
    email: string;
    userName: string;
    type: 'CLIENT' | 'PROVIDER';
    createdAt: Date;
    updatedAt: Date;

    static fromEntity(user: User): UserResponseDto {
        return {
            uuid: user.uuid,
            email: user.email,
            userName: user.userName,
            type: user.type,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    static fromEntities(users: User[]): UserResponseDto[] {
        return users.map((user) => this.fromEntity(user));
    }
}
