import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
    GetObjectCommand,
    NotFound,
    NoSuchKey,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
    IS3Service,
    UploadOptions,
    PresignedUrlOptions,
} from '../../domain/interfaces/s3-service.interface';

@Injectable()
export class S3Service implements IS3Service {
    private readonly logger = new Logger(S3Service.name);
    private readonly s3Client: S3Client;

    constructor(private readonly configService: ConfigService) {
        const region = this.configService.get<string>('AWS_REGION', 'us-east-1');
        const endpoint = this.configService.get<string>('AWS_ENDPOINT');

        this.s3Client = new S3Client({
            region,
            endpoint,
            forcePathStyle: !!endpoint, // Necessário para LocalStack/DynamoDB Local
            credentials: {
                accessKeyId: this.configService.get<string>(
                    'AWS_ACCESS_KEY_ID',
                    'test',
                ),
                secretAccessKey: this.configService.get<string>(
                    'AWS_SECRET_ACCESS_KEY',
                    'test',
                ),
            },
        });

        this.logger.log(
            `S3 Client initialized for region: ${region}${endpoint ? ` with endpoint: ${endpoint}` : ''}`,
        );
    }

    async upload(options: UploadOptions): Promise<{ key: string; etag: string }> {
        const { bucket, key, body, contentType, metadata } = options;

        try {
            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: body,
                ContentType: contentType,
                Metadata: metadata,
                ServerSideEncryption: 'AES256',
            });

            const response = await this.s3Client.send(command);

            this.logger.log(`Arquivo enviado com sucesso: ${key}`);

            return {
                key,
                etag: response.ETag || '',
            };
        } catch (error) {
            this.logger.error(
                `Falha ao enviar arquivo para S3: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                error instanceof Error ? error.stack : undefined,
            );
            throw new Error(
                `Upload para S3 falhou: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
            );
        }
    }

    async generatePresignedUrl(options: PresignedUrlOptions): Promise<string> {
        const { bucket, key, expiresIn } = options;

        try {
            const command = new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            const url = await getSignedUrl(this.s3Client, command, { expiresIn });

            this.logger.log(
                `URL assinada gerada para: ${key}, expira em ${expiresIn}s`,
            );

            return url;
        } catch (error) {
            this.logger.error(
                `Falha ao gerar URL assinada: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                error instanceof Error ? error.stack : undefined,
            );
            throw new Error(
                `Geração de URL assinada falhou: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
            );
        }
    }

    async delete(bucket: string, key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            await this.s3Client.send(command);

            this.logger.log(`Arquivo deletado com sucesso: ${key}`);
        } catch (error) {
            this.logger.error(
                `Falha ao deletar arquivo do S3: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                error instanceof Error ? error.stack : undefined,
            );
            throw new Error(
                `Deleção no S3 falhou: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
            );
        }
    }

    async exists(bucket: string, key: string): Promise<boolean> {
        try {
            const command = new HeadObjectCommand({
                Bucket: bucket,
                Key: key,
            });

            await this.s3Client.send(command);
            return true;
        } catch (error) {
            if (error instanceof NotFound || error instanceof NoSuchKey) {
                return false;
            }
            throw error;
        }
    }
}
