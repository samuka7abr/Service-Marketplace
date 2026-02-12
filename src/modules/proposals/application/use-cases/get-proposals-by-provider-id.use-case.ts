import { Injectable, Inject } from '@nestjs/common';
import { IProposalRepository } from '../../domain/interfaces/proposal.repository.interface';
import { Proposal } from '../../domain/entities/proposal.entity';

@Injectable()
export class GetProposalsByProviderIdUseCase {
    constructor(
        @Inject('IProposalRepository')
        private proposalRepository: IProposalRepository,
    ) {}

    async execute(providerId: string): Promise<Proposal[]> {
        return await this.proposalRepository.findByProviderId(providerId);
    }
}
