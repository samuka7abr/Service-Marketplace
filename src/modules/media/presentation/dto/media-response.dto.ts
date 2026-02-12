import { ApiProperty } from '@nestjs/swagger';
import { Media } from '../../domain/entities/media.entity';

export class MediaResponseDto {
    @ApiProperty({
        description: 'UUID da mídia',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    uuid: string;

    @ApiProperty({
        description: 'UUID do usuário',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    userId: string;

    @ApiProperty({
        description: 'UUID da solicitação (opcional)',
        example: '550e8400-e29b-41d4-a716-446655440002',
        required: false,
        nullable: true,
    })
    requestId: string | null;

    @ApiProperty({
        description: 'Nome do arquivo',
        example: 'documento.pdf',
    })
    filename: string;

    @ApiProperty({
        description: 'Nome original do arquivo',
        example: 'Contrato de Prestação de Serviços.pdf',
    })
    originalFilename: string;

    @ApiProperty({
        description: 'Tamanho do arquivo em bytes',
        example: 1024000,
    })
    size: number;

    @ApiProperty({
        description: 'Tipo MIME do arquivo',
        example: 'application/pdf',
    })
    mimeType: string;

    @ApiProperty({
        description: 'Hash SHA256 do arquivo',
        example: 'a1b2c3d4e5f6...',
    })
    fileHash: string;

    @ApiProperty({
        description: 'URL assinada para acesso ao arquivo',
        example: 'https://s3.amazonaws.com/...',
        required: false,
        nullable: true,
    })
    presignedUrl: string | null;

    @ApiProperty({
        description: 'Data de expiração da URL assinada',
        example: '2026-02-12T12:00:00.000Z',
        required: false,
        nullable: true,
    })
    presignedUrlExpiresAt: Date | null;

    @ApiProperty({
        description: 'Data de criação',
        example: '2026-02-11T12:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Data da última atualização',
        example: '2026-02-11T12:00:00.000Z',
    })
    updatedAt: Date;

    static fromEntity(media: Media): MediaResponseDto {
        return {
            uuid: media.uuid,
            userId: media.userId,
            requestId: media.requestId,
            filename: media.filename,
            originalFilename: media.originalFilename,
            size: media.size,
            mimeType: media.mimeType,
            fileHash: media.fileHash,
            presignedUrl: media.presignedUrl,
            presignedUrlExpiresAt: media.presignedUrlExpiresAt,
            createdAt: media.createdAt,
            updatedAt: media.updatedAt,
        };
    }

    static fromEntities(mediaList: Media[]): MediaResponseDto[] {
        return mediaList.map((media) => this.fromEntity(media));
    }
}
