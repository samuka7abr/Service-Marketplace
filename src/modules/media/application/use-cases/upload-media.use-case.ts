import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMediaRepository } from '../../domain/interfaces/media.repository.interface';
import { IS3Service } from '../../domain/interfaces/s3-service.interface';
import { Media } from '../../domain/entities/media.entity';
import { MediaValidationService } from '../../infrastructure/services/media-validation.service';
import * as crypto from 'crypto';
import * as path from 'path';

export interface UploadMediaInput {
    userId: string;
    requestId?: string;
    file: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
        size: number;
    };
}

@Injectable()
export class UploadMediaUseCase {
    private readonly logger = new Logger(UploadMediaUseCase.name);
    private readonly bucket: string;
    private readonly presignedUrlExpiration: number;

    constructor(
        @Inject('IMediaRepository')
        private readonly mediaRepository: IMediaRepository,
        @Inject('IS3Service')
        private readonly s3Service: IS3Service,
        private readonly configService: ConfigService,
        private readonly mediaValidationService: MediaValidationService,
    ) {
        this.bucket = this.configService.get<string>(
            'AWS_S3_BUCKET',
            'marketplace-bucket',
        );
        const expiration = this.configService.get<string>(
            'PRESIGNED_URL_EXPIRATION',
            '3600',
        );
        this.presignedUrlExpiration = parseInt(expiration, 10);
    }

    async execute(input: UploadMediaInput): Promise<Media> {
        const { userId, requestId, file } = input;

        // 1. Validar arquivo
        this.mediaValidationService.validateFile(file);

        // 2. Gerar hash do arquivo
        const fileHash = this.generateFileHash(file.buffer);

        // 3. Gerar chave S3
        const s3Key = this.generateS3Key(file.originalname);

        // 4. Upload para S3
        try {
            const uploadResult = await this.s3Service.upload({
                bucket: this.bucket,
                key: s3Key,
                body: file.buffer,
                contentType: file.mimetype,
                metadata: {
                    userId,
                    requestId: requestId || '',
                    originalFilename: file.originalname,
                },
            });

            this.logger.log(`Arquivo enviado para S3: ${uploadResult.key}`);
        } catch (error) {
            this.logger.error(`Erro ao enviar para S3: ${error}`);
            throw new Error('Falha ao fazer upload do arquivo');
        }

        // 5. Criar mídia no DynamoDB
        const now = new Date();
        const media = new Media(
            crypto.randomUUID(),
            userId,
            requestId || null,
            s3Key,
            this.bucket,
            path.basename(s3Key),
            file.originalname,
            file.size,
            file.mimetype,
            fileHash,
            null, // thumbnailS3Key
            now,
            now,
        );

        try {
            await this.mediaRepository.create(media);
            this.logger.log(`Mídia criada com sucesso: ${media.uuid}`);
        } catch (error) {
            // Se falhar ao salvar no banco, deletar do S3
            try {
                await this.s3Service.delete(this.bucket, s3Key);
                this.logger.warn(`Rollback: arquivo deletado do S3: ${s3Key}`);
            } catch (deleteError) {
                this.logger.error(
                    `Falha ao fazer rollback do S3: ${deleteError}`,
                );
            }
            throw new Error('Falha ao salvar informações da mídia');
        }

        // 6. Gerar presigned URL
        try {
            media.presignedUrl = await this.s3Service.generatePresignedUrl({
                bucket: this.bucket,
                key: s3Key,
                expiresIn: this.presignedUrlExpiration,
            });
            media.presignedUrlExpiresAt = new Date(
                Date.now() + this.presignedUrlExpiration * 1000,
            );
        } catch (presignedError) {
            this.logger.warn(
                `Falha ao gerar presigned URL: ${presignedError}`,
            );
            media.presignedUrl = null;
            media.presignedUrlExpiresAt = null;
        }

        return media;
    }

    private generateFileHash(buffer: Buffer): string {
        return crypto.createHash('sha256').update(buffer).digest('hex');
    }

    private generateS3Key(originalFilename: string): string {
        const uuid = crypto.randomUUID();
        const ext = path.extname(originalFilename);
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `media/uploads/${year}/${month}/${day}/${uuid}${ext}`;
    }
}
