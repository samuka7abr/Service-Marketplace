import { Injectable, Inject } from '@nestjs/common';
import { IRequestRepository } from '../../domain/interfaces/request.repository.interface';
import { Request } from '../../domain/entities/request.entity';

@Injectable()
export class GetRequestsByServiceIdUseCase {
    constructor(
        @Inject('IRequestRepository')
        private requestRepository: IRequestRepository,
    ) {}

    async execute(serviceId: string): Promise<Request[]> {
        return await this.requestRepository.findByServiceId(serviceId);
    }
}
