import { Injectable, Inject } from '@nestjs/common';
import { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class GetServicesByCategoryUseCase {
    constructor(
        @Inject('IServiceRepository')
        private serviceRepository: IServiceRepository,
    ) {}

    async execute(category: string): Promise<Service[]> {
        return await this.serviceRepository.findByCategory(category);
    }
}
