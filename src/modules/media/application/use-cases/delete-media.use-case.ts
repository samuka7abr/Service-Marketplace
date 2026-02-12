import { Injectable, Logger, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMediaRepository } from '../../domain/interfaces/media.repository.interface';
import { IS3Service } from '../../domain/interfaces/s3-service.interface';

export interface DeleteMediaInput {
    userId: string;
    mediaId: string;
}

@Injectable()
export class DeleteMediaUseCase {
    private readonly logger = new Logger(DeleteMediaUseCase.name);
    private readonly bucket: string;

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
    }

    async execute(input: DeleteMediaInput): Promise<void> {
        const { userId, mediaId } = input;

        // 1. Buscar mídia
        const media = await this.mediaRepository.findById(mediaId);
        if (!media) {
            throw new NotFoundException('Mídia não encontrada');
        }

        // 2. Verificar permissão (só o dono pode deletar)
        if (media.userId !== userId) {
            throw new ForbiddenException('Você não tem permissão para deletar esta mídia');
        }

        // 3. Deletar do S3
        try {
            await this.s3Service.delete(this.bucket, media.s3Key);
            this.logger.log(`Arquivo deletado do S3: ${media.s3Key}`);

            // Deletar thumbnail se existir
            if (media.thumbnailS3Key) {
                try {
                    await this.s3Service.delete(this.bucket, media.thumbnailS3Key);
                    this.logger.log(`Thumbnail deletada do S3: ${media.thumbnailS3Key}`);
                } catch (thumbError) {
                    this.logger.warn(`Falha ao deletar thumbnail: ${thumbError}`);
                }
            }
        } catch (error) {
            this.logger.error(`Erro ao deletar do S3: ${error}`);
            throw new Error('Falha ao deletar arquivo do S3');
        }

        // 4. Deletar do DynamoDB
        try {
            await this.mediaRepository.delete(mediaId);
            this.logger.log(`Mídia deletada do banco: ${mediaId}`);
        } catch (error) {
            this.logger.error(`Erro ao deletar do banco: ${error}`);
            throw new Error('Falha ao deletar informações da mídia');
        }
    }
}
