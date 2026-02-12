import { IsOptional, IsUUID, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListMediaQueryDto {
    @ApiProperty({
        description: 'UUID da solicitação (filtro opcional)',
        example: '550e8400-e29b-41d4-a716-446655440000',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'requestId deve ser um UUID válido' })
    requestId?: string;

    @ApiProperty({
        description: 'Limite de resultados por página',
        example: 20,
        required: false,
        minimum: 1,
        maximum: 100,
        default: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'limit deve ser um número' })
    @Min(1, { message: 'limit deve ser no mínimo 1' })
    @Max(100, { message: 'limit deve ser no máximo 100' })
    limit?: number = 20;

    @ApiProperty({
        description: 'Token de paginação (lastKey da página anterior)',
        example: 'eyJQSyI6Ik1FRElBIyIsIlNLIjoiTUVUQSJ9',
        required: false,
    })
    @IsOptional()
    lastKey?: string;
}
