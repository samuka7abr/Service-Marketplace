import { User } from '../entities/user.entity';

export interface IUserRepository {
    create(user: User): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findByUserName(userName: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
}
