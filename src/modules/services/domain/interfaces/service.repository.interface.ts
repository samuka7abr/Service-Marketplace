import { Service } from '../entities/service.entity';

export interface IServiceRepository {
    create(service: Service): Promise<void>;
    findById(uuid: string): Promise<Service | null>;
    findByName(name: string): Promise<Service | null>;
    findByCategory(category: string): Promise<Service[]>;
    findAll(): Promise<Service[]>;
    findAllActive(): Promise<Service[]>;
    update(service: Service): Promise<void>;
    delete(uuid: string): Promise<void>;
}

