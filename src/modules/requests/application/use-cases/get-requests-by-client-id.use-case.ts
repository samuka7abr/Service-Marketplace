import { Injectable, Inject } from '@nestjs/common';
import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { Request } from '../../domain/entities/request.entity';

@Injectable()
export class GetRequestsByClientIdUseCase {
    constructor(
        @Inject('IRequestRepository')
        private requestRepository: IRequestRepository,
    ) {}

    async execute(clientId: string): Promise<Request[]> {
        return await this.requestRepository.findByClientId(clientId);
    }
}
