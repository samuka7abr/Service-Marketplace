import { IsString, IsNumber, IsPositive, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '../../domain/entities/request.entity';

export class UpdateRequestDto {
    @ApiProperty({
        description: 'Título da solicitação',
        example: 'Preciso de um site para minha empresa',
        required: false,
        minLength: 5,
        maxLength: 150,
    })
    @IsOptional()
    @IsString({ message: 'O título deve ser uma string' })
    @MinLength(5, { message: 'O título deve ter no mínimo 5 caracteres' })
    @MaxLength(150, { message: 'O título deve ter no máximo 150 caracteres' })
    title?: string;

    @ApiProperty({
        description: 'Descrição detalhada da solicitação',
        example: 'Preciso de um site institucional com 5 páginas, design moderno e responsivo',
        required: false,
        minLength: 20,
        maxLength: 1000,
    })
    @IsOptional()
    @IsString({ message: 'A descrição deve ser uma string' })
    @MinLength(20, { message: 'A descrição deve ter no mínimo 20 caracteres' })
    @MaxLength(1000, { message: 'A descrição deve ter no máximo 1000 caracteres' })
    description?: string;

    @ApiProperty({
        description: 'Orçamento disponível (em reais)',
        example: 5000.00,
        required: false,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber({}, { message: 'O orçamento deve ser um número' })
    @IsPositive({ message: 'O orçamento deve ser um valor positivo' })
    budget?: number;

    @ApiProperty({
        description: 'Localização do serviço',
        example: 'São Paulo, SP',
        required: false,
        minLength: 3,
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: 'A localização deve ser uma string' })
    @MinLength(3, { message: 'A localização deve ter no mínimo 3 caracteres' })
    @MaxLength(100, { message: 'A localização deve ter no máximo 100 caracteres' })
    location?: string;

    @ApiProperty({
        description: 'Status da solicitação',
        example: RequestStatus.IN_NEGOTIATION,
        enum: RequestStatus,
        required: false,
    })
    @IsOptional()
    @IsEnum(RequestStatus, { message: 'Status inválido' })
    status?: RequestStatus;
}
