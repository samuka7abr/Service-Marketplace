import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProposalRepository } from '../../domain/interfaces/proposal.repository.interface';
import { Proposal, ProposalStatus } from '../../domain/entities/proposal.entity';

@Injectable()
export class UpdateProposalUseCase {
    constructor(
        @Inject('IProposalRepository')
        private proposalRepository: IProposalRepository,
    ) {}

    async execute(
        uuid: string,
        amount?: number,
        deliveryTime?: number,
        description?: string,
        status?: ProposalStatus,
    ): Promise<Proposal> {
        const proposal = await this.proposalRepository.findById(uuid);
        if (!proposal) {
            throw new NotFoundException('Proposta não encontrada');
        }

        // Atualizar apenas os campos fornecidos
        if (amount !== undefined) proposal.amount = amount;
        if (deliveryTime !== undefined) proposal.deliveryTime = deliveryTime;
        if (description !== undefined) proposal.description = description;
        if (status !== undefined) proposal.status = status;
        proposal.updatedAt = new Date();

        await this.proposalRepository.update(proposal);
        return proposal;
    }
}
