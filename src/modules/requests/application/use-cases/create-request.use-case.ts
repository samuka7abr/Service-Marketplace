import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { Request, RequestStatus } from '../../domain/entities/request.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateRequestUseCase {
    constructor(
        @Inject('IRequestRepository')
        private requestRepository: IRequestRepository,
    ) {}

    async execute(
        clientId: string,
        serviceId: string,
        title: string,
        description: string,
        budget: number,
        location: string,
    ): Promise<Request> {
        const now = new Date();
        const request = new Request(
            randomUUID(),
            clientId,
            serviceId,
            title,
            description,
            budget,
            location,
            RequestStatus.OPEN,
            now,
            now,
        );

        await this.requestRepository.create(request);
        return request;
    }
}
