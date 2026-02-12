import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';

@Injectable()
export class DeleteRequestUseCase {
    constructor(
        @Inject('IRequestRepository')
        private requestRepository: IRequestRepository,
    ) {}

    async execute(uuid: string): Promise<void> {
        const request = await this.requestRepository.findById(uuid);
        if (!request) {
            throw new NotFoundException('Solicitação não encontrada');
        }

        await this.requestRepository.delete(uuid);
    }
}
