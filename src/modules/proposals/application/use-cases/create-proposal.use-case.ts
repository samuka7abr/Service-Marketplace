import { Injectable, Inject } from '@nestjs/common';
import { IProposalRepository } from '../../domain/interfaces/proposal.repository.interface';
import { Proposal, ProposalStatus } from '../../domain/entities/proposal.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateProposalUseCase {
    constructor(
        @Inject('IProposalRepository')
        private proposalRepository: IProposalRepository,
    ) {}

    async execute(
        requestId: string,
        providerId: string,
        amount: number,
        deliveryTime: number,
        description: string,
    ): Promise<Proposal> {
        const now = new Date();
        const proposal = new Proposal(
            randomUUID(),
            requestId,
            providerId,
            amount,
            deliveryTime,
            description,
            ProposalStatus.PENDING,
            now,
            now,
        );

        await this.proposalRepository.create(proposal);
        return proposal;
    }
}
