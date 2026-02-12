import { Injectable, Inject } from '@nestjs/common';
import { IServiceRepository } from '../../domain/interfaces/service.repository.interface';
import { Service } from '../../domain/entities/service.entity';

@Injectable()
export class GetAllActiveServicesUseCase {
    constructor(
        @Inject('IServiceRepository')
        private serviceRepository: IServiceRepository,
    ) {}

    async execute(): Promise<Service[]> {
        return await this.serviceRepository.findAllActive();
    }
}
