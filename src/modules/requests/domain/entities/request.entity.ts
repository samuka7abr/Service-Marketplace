export enum RequestStatus {
    OPEN = 'OPEN',
    IN_NEGOTIATION = 'IN_NEGOTIATION',
    CLOSED = 'CLOSED',
    CANCELLED = 'CANCELLED',
}

export class Request {
    constructor(
        public uuid: string,
        public clientId: string,
        public serviceId: string,
        public title: string,
        public description: string,
        public budget: number,
        public location: string,
        public status: RequestStatus,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}
}
