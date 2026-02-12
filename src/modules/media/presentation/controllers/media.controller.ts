import {
    Controller,
    Post,
    Get,
    Delete,
    Query,
    Param,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiConsumes,
    ApiBody,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';

// DTOs
import { MediaResponseDto } from '../dto/media-response.dto';
import { ListMediaQueryDto } from '../dto/list-media-query.dto';

// Use Cases
import { UploadMediaUseCase } from '../../application/use-cases/upload-media.use-case';
import { ListMediaUseCase } from '../../application/use-cases/list-media.use-case';
import { DeleteMediaUseCase } from '../../application/use-cases/delete-media.use-case';

@ApiTags('Mídia')
@Controller('media')
export class MediaController {
    constructor(
        private readonly uploadMediaUseCase: UploadMediaUseCase,
        private readonly listMediaUseCase: ListMediaUseCase,
        private readonly deleteMediaUseCase: DeleteMediaUseCase,
    ) {}

    @Post('upload')
    @ApiOperation({ summary: 'Upload de arquivo' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Arquivo para upload',
                },
                userId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'UUID do usuário',
                },
                requestId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'UUID da solicitação (opcional)',
                },
            },
            required: ['file', 'userId'],
        },
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Arquivo enviado com sucesso',
        type: MediaResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Arquivo inválido ou dados incorretos',
    })
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(
        FileInterceptor('file', {
            limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
        }),
    )
    async uploadMedia(
        @UploadedFile() file: Express.Multer.File,
        @Query('userId', new ParseUUIDPipe()) userId: string,
        @Query('requestId', new ParseUUIDPipe({ optional: true }))
        requestId?: string,
    ): Promise<MediaResponseDto> {
        if (!file) {
            throw new BadRequestException('Arquivo é obrigatório');
        }

        const media = await this.uploadMediaUseCase.execute({
            userId,
            requestId,
            file: {
                buffer: file.buffer,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
            },
        });

        return MediaResponseDto.fromEntity(media);
    }

    @Get()
    @ApiOperation({ summary: 'Listar mídias do usuário' })
    @ApiQuery({
        name: 'userId',
        type: String,
        description: 'UUID do usuário',
        required: true,
    })
    @ApiQuery({
        name: 'requestId',
        type: String,
        description: 'UUID da solicitação (filtro opcional)',
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        type: Number,
        description: 'Limite de resultados',
        required: false,
        example: 20,
    })
    @ApiQuery({
        name: 'lastKey',
        type: String,
        description: 'Token de paginação',
        required: false,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de mídias',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/MediaResponseDto' },
                },
                lastKey: { type: 'string', nullable: true },
                total: { type: 'number' },
            },
        },
    })
    async listMedia(
        @Query('userId', new ParseUUIDPipe()) userId: string,
        @Query() query: ListMediaQueryDto,
    ): Promise<{
        data: MediaResponseDto[];
        lastKey?: string;
        total: number;
    }> {
        const result = await this.listMediaUseCase.execute({
            userId,
            requestId: query.requestId,
            limit: query.limit,
            lastKey: query.lastKey,
        });

        return {
            data: MediaResponseDto.fromEntities(result.data),
            lastKey: result.lastKey,
            total: result.total,
        };
    }

    @Delete(':uuid')
    @ApiOperation({ summary: 'Deletar uma mídia' })
    @ApiParam({
        name: 'uuid',
        description: 'UUID da mídia',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiQuery({
        name: 'userId',
        type: String,
        description: 'UUID do usuário',
        required: true,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Mídia deletada com sucesso',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Mídia não encontrada',
    })
    @ApiResponse({
        status: HttpStatus.FORBIDDEN,
        description: 'Usuário não tem permissão para deletar esta mídia',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteMedia(
        @Param('uuid', new ParseUUIDPipe()) uuid: string,
        @Query('userId', new ParseUUIDPipe()) userId: string,
    ): Promise<void> {
        await this.deleteMediaUseCase.execute({
            userId,
            mediaId: uuid,
        });
    }
}
