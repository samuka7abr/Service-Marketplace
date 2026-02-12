export enum ProposalStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN',
}

export class Proposal {
    constructor(
        public uuid: string,
        public requestId: string,
        public providerId: string,
        public amount: number,
        public deliveryTime: number, // em dias
        public description: string,
        public status: ProposalStatus,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
