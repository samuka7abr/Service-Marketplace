import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { Service } from '../../domain/entities/service.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateServiceUseCase {
    constructor(
        @Inject('IServiceRepository')
        private serviceRepository: IServiceRepository,
    ) {}

    async execute(
        name: string,
        description: string,
        category: string,
    ): Promise<Service> {
        // Verificar se já existe um serviço com o mesmo nome
        const existingService = await this.serviceRepository.findByName(name);
        if (existingService) {
            throw new ConflictException('Já existe um serviço com este nome');
        }

        const now = new Date();
        const service = new Service(
            randomUUID(),
            name,
            description,
            category,
            true, // isActive por padrão
            now,
            now,
        );

        await this.serviceRepository.create(service);
        return service;
    }
}
