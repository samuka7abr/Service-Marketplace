export class Media {
    constructor(
        public uuid: string,
        public userId: string,
        public requestId: string | null, // Mídia pode estar associada a uma solicitação
        public s3Key: string,
        public s3Bucket: string,
        public filename: string,
        public originalFilename: string,
        public size: number,
        public mimeType: string,
        public fileHash: string,
        public thumbnailS3Key: string | null,
        public createdAt: Date,
        public updatedAt: Date,
    ) {}

    // Campos transientes (não persistidos)
    public presignedUrl: string | null = null;
    public presignedUrlExpiresAt: Date | null = null;
}
