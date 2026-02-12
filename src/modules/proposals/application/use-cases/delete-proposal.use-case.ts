import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProposalRepository } from '../../domain/interfaces/proposal.repository.interface';

@Injectable()
export class DeleteProposalUseCase {
    constructor(
        @Inject('IProposalRepository')
        private proposalRepository: IProposalRepository,
    ) {}

    async execute(uuid: string): Promise<void> {
        const proposal = await this.proposalRepository.findById(uuid);
        if (!proposal) {
            throw new NotFoundException('Proposta não encontrada');
        }

        await this.proposalRepository.delete(uuid);
    }
}
