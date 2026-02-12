import { Injectable, Inject } from '@nestjs/common';
import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { Request } from '../../domain/entities/request.entity';

@Injectable()
export class GetRequestsByStatusUseCase {
    constructor(
        @Inject('IRequestRepository')
        private requestRepository: IRequestRepository,
    ) {}

    async execute(status: string): Promise<Request[]> {
        return await this.requestRepository.findByStatus(status);
    }
}
