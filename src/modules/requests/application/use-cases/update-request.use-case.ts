import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { Request, RequestStatus } from '../../domain/entities/request.entity';

@Injectable()
export class UpdateRequestUseCase {
    constructor(
        @Inject('IRequestRepository')
        private requestRepository: IRequestRepository,
    ) {}

    async execute(
        uuid: string,
        title?: string,
        description?: string,
        budget?: number,
        location?: string,
        status?: RequestStatus,
    ): Promise<Request> {
        const request = await this.requestRepository.findById(uuid);
        if (!request) {
            throw new NotFoundException('Solicitação não encontrada');
        }

        // Atualizar apenas os campos fornecidos
        if (title !== undefined) request.title = title;
        if (description !== undefined) request.description = description;
        if (budget !== undefined) request.budget = budget;
        if (location !== undefined) request.location = location;
        if (status !== undefined) request.status = status;
        request.updatedAt = new Date();

        await this.requestRepository.update(request);
        return request;
    }
}
