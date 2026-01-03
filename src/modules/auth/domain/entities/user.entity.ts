export class User {
    constructor(
        public uuid: string,
        public email: string,
        public password: string,
        public userName: string,
        public type: 'CLIENT' | 'PROVIDER',
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}
