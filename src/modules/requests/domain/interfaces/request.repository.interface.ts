import { Request } from '../entities/request.entity';

export interface IRequestRepository {
    create(request: Request): Promise<void>;
    findById(uuid: string): Promise<Request | null>;
    findByClientId(clientId: string): Promise<Request[]>;
    findByServiceId(serviceId: string): Promise<Request[]>;
    findByStatus(status: string): Promise<Request[]>;
    findAll(): Promise<Request[]>;
    update(request: Request): Promise<void>;
    delete(uuid: string): Promise<void>;
}
