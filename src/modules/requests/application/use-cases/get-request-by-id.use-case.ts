import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { Request } from '../../domain/entities/request.entity';

@Injectable()
export class GetRequestByIdUseCase {
    constructor(
        @Inject('IRequestRepository')
        private requestRepository: IRequestRepository,
    ) {}

    async execute(uuid: string): Promise<Request> {
        const request = await this.requestRepository.findById(uuid);
        if (!request) {
            throw new NotFoundException('Solicitação não encontrada');
        }
        return request;
    }
}
