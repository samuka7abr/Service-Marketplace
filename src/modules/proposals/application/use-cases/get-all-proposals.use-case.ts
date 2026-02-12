import { Injectable, Inject } from '@nestjs/common';
import { IProposalRepository } from '../../domain/interfaces/proposal.repository.interface';
import { Proposal } from '../../domain/entities/proposal.entity';

@Injectable()
export class GetAllProposalsUseCase {
    constructor(
        @Inject('IProposalRepository')
        private proposalRepository: IProposalRepository,
    ) {}

    async execute(): Promise<Proposal[]> {
        return await this.proposalRepository.findAll();
    }
}
