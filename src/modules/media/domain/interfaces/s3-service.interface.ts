export interface UploadOptions {
    bucket: string;
    key: string;
    body: Buffer;
    contentType: string;
    metadata?: Record<string, string>;
}

export interface PresignedUrlOptions {
    bucket: string;
    key: string;
    expiresIn: number; // segundos
}

export interface IS3Service {
    upload(options: UploadOptions): Promise<{ key: string; etag: string }>;
    generatePresignedUrl(options: PresignedUrlOptions): Promise<string>;
    delete(bucket: string, key: string): Promise<void>;
    exists(bucket: string, key: string): Promise<boolean>;
}
