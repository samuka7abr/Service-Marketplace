import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProposalRepository } from '../../domain/interfaces/proposal.repository.interface';
import { Proposal } from '../../domain/entities/proposal.entity';

@Injectable()
export class GetProposalByIdUseCase {
    constructor(
        @Inject('IProposalRepository')
        private proposalRepository: IProposalRepository,
    ) {}

    async execute(uuid: string): Promise<Proposal> {
        const proposal = await this.proposalRepository.findById(uuid);
        if (!proposal) {
            throw new NotFoundException('Proposta não encontrada');
        }
        return proposal;
    }
}
