import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class UpdateServiceUseCase {
    constructor(
        @Inject('IServiceRepository')
        private serviceRepository: IServiceRepository,
    ) {}

    async execute(
        uuid: string,
        name?: string,
        description?: string,
        category?: string,
        isActive?: boolean,
    ): Promise<Service> {
        const service = await this.serviceRepository.findById(uuid);
        if (!service) {
            throw new NotFoundException('Serviço não encontrado');
        }

        // Atualizar apenas os campos fornecidos
        if (name !== undefined) service.name = name;
        if (description !== undefined) service.description = description;
        if (category !== undefined) service.category = category;
        if (isActive !== undefined) service.isActive = isActive;
        service.updatedAt = new Date();

        await this.serviceRepository.update(service);
        return service;
    }
}
