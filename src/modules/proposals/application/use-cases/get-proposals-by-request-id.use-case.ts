import { Injectable, Inject } from '@nestjs/common';
import { IProposalRepository } from '../../domain/interfaces/proposal.repository.interface';
import { Proposal } from '../../domain/entities/proposal.entity';

@Injectable()
export class GetProposalsByRequestIdUseCase {
    constructor(
        @Inject('IProposalRepository')
        private proposalRepository: IProposalRepository,
    ) {}

    async execute(requestId: string): Promise<Proposal[]> {
        return await this.proposalRepository.findByRequestId(requestId);
    }
}
