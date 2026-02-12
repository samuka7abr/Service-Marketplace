import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IServiceRepository } from '../../domain/interfaces/service.repository.interface';

@Injectable()
export class DeleteServiceUseCase {
    constructor(
        @Inject('IServiceRepository')
        private serviceRepository: IServiceRepository,
    ) {}

    async execute(uuid: string): Promise<void> {
        const service = await this.serviceRepository.findById(uuid);
        if (!service) {
            throw new NotFoundException('Serviço não encontrado');
        }

        await this.serviceRepository.delete(uuid);
    }
}
