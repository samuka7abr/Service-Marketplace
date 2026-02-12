import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class GetServiceByIdUseCase {
    constructor(
        @Inject('IServiceRepository')
        private serviceRepository: IServiceRepository,
    ) {}

    async execute(uuid: string): Promise<Service> {
        const service = await this.serviceRepository.findById(uuid);
        if (!service) {
            throw new NotFoundException('Serviço não encontrado');
        }
        return service;
    }
}
