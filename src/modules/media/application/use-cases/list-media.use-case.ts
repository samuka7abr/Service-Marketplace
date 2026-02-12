import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMediaRepository } from '../../domain/interfaces/media.repository.interface';
import { IS3Service } from '../../domain/interfaces/s3-service.interface';
import { Media } from '../../domain/entities/media.entity';

export interface ListMediaInput {
    userId: string;
    requestId?: string;
    limit?: number;
    lastKey?: string;
}

export interface ListMediaOutput {
    data: Media[];
    lastKey?: string;
    total: number;
}

@Injectable()
export class ListMediaUseCase {
    private readonly logger = new Logger(ListMediaUseCase.name);
    private readonly bucket: string;
    private readonly presignedUrlExpiration: number;

    constructor(
        @Inject('IMediaRepository')
        private readonly mediaRepository: IMediaRepository,
        @Inject('IS3Service')
        private readonly s3Service: IS3Service,
        private readonly configService: ConfigService,
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

    async execute(input: ListMediaInput): Promise<ListMediaOutput> {
        const { userId, requestId, limit = 20, lastKey } = input;

        let mediaList: Media[];
        let nextLastKey: string | undefined;

        if (requestId) {
            // Buscar por request
            mediaList = await this.mediaRepository.findByRequestId(requestId);
        } else {
            // Buscar por usuário com paginação
            const result = await this.mediaRepository.findByUserId(
                userId,
                limit,
                lastKey,
            );
            mediaList = result.items;
            nextLastKey = result.lastKey;
        }

        // Gerar presigned URLs para cada mídia
        const mediaWithUrls = await Promise.all(
            mediaList.map(async (media) => {
                try {
                    media.presignedUrl =
                        await this.s3Service.generatePresignedUrl({
                            bucket: this.bucket,
                            key: media.s3Key,
                            expiresIn: this.presignedUrlExpiration,
                        });
                    media.presignedUrlExpiresAt = new Date(
                        Date.now() + this.presignedUrlExpiration * 1000,
                    );
                } catch (error) {
                    this.logger.warn(
                        `Falha ao gerar presigned URL para ${media.uuid}: ${error}`,
                    );
                    media.presignedUrl = null;
                    media.presignedUrlExpiresAt = null;
                }
                return media;
            }),
        );

        // Contar total
        const total = await this.mediaRepository.countByUserId(userId);

        return {
            data: mediaWithUrls,
            lastKey: nextLastKey,
            total,
        };
    }
}
