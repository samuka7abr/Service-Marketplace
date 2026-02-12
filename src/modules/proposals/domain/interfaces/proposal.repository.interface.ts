import { Proposal } from '../entities/proposal.entity';

export interface IProposalRepository {
    create(proposal: Proposal): Promise<void>;
    findById(uuid: string): Promise<Proposal | null>;
    findByRequestId(requestId: string): Promise<Proposal[]>;
    findByProviderId(providerId: string): Promise<Proposal[]>;
    findByStatus(status: string): Promise<Proposal[]>;
    findAll(): Promise<Proposal[]>;
    update(proposal: Proposal): Promise<void>;
    delete(uuid: string): Promise<void>;
}
