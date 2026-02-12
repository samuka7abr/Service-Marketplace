import { Injectable, BadRequestException } from '@nestjs/common';

export interface ValidatableFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}

@Injectable()
export class MediaValidationService {
    private readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

    private readonly ALLOWED_MIME_TYPES = [
        // Imagens
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        // Documentos
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        // Áudio
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        // Vídeo
        'video/mp4',
        'video/webm',
        'video/quicktime',
    ];

    validateFile(file: ValidatableFile): void {
        // 1. Validar tamanho
        if (file.size > this.MAX_FILE_SIZE) {
            throw new BadRequestException(
                `Arquivo muito grande. Tamanho máximo: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
            );
        }

        // 2. Validar se arquivo existe
        if (!file.buffer || file.buffer.length === 0) {
            throw new BadRequestException('Arquivo vazio');
        }

        // 3. Validar MIME type
        if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new BadRequestException(
                `Tipo de arquivo não permitido: ${file.mimetype}`,
            );
        }

        // 4. Validar nome do arquivo
        if (!file.originalname || file.originalname.trim().length === 0) {
            throw new BadRequestException('Nome do arquivo inválido');
        }

        // 5. Verificar extensões perigosas
        const dangerousExtensions = [
            '.exe',
            '.bat',
            '.sh',
            '.cmd',
            '.com',
            '.scr',
            '.vbs',
            '.js',
            '.jar',
        ];
        const lowerName = file.originalname.toLowerCase();
        const hasDangerousExtension = dangerousExtensions.some((ext) =>
            lowerName.endsWith(ext),
        );

        if (hasDangerousExtension) {
            throw new BadRequestException(
                'Extensão de arquivo não permitida por questões de segurança',
            );
        }
    }

    getMediaCategory(
        mimeType: string,
    ): 'image' | 'document' | 'audio' | 'video' | 'other' {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('sheet'))
            return 'document';
        return 'other';
    }
}
