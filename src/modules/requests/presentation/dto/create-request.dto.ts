import { IsString, IsNotEmpty, IsNumber, IsPositive, MinLength, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
    @ApiProperty({
        description: 'UUID do cliente que está fazendo a solicitação',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID('4', { message: 'O clientId deve ser um UUID válido' })
    @IsNotEmpty({ message: 'O clientId é obrigatório' })
    clientId: string;

    @ApiProperty({
        description: 'UUID do serviço solicitado',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    @IsUUID('4', { message: 'O serviceId deve ser um UUID válido' })
    @IsNotEmpty({ message: 'O serviceId é obrigatório' })
    serviceId: string;

    @ApiProperty({
        description: 'Título da solicitação',
        example: 'Preciso de um site para minha empresa',
        minLength: 5,
        maxLength: 150,
    })
    @IsString({ message: 'O título deve ser uma string' })
    @IsNotEmpty({ message: 'O título é obrigatório' })
    @MinLength(5, { message: 'O título deve ter no mínimo 5 caracteres' })
    @MaxLength(150, { message: 'O título deve ter no máximo 150 caracteres' })
    title: string;

    @ApiProperty({
        description: 'Descrição detalhada da solicitação',
        example: 'Preciso de um site institucional com 5 páginas, design moderno e responsivo',
        minLength: 20,
        maxLength: 1000,
    })
    @IsString({ message: 'A descrição deve ser uma string' })
    @IsNotEmpty({ message: 'A descrição é obrigatória' })
    @MinLength(20, { message: 'A descrição deve ter no mínimo 20 caracteres' })
    @MaxLength(1000, { message: 'A descrição deve ter no máximo 1000 caracteres' })
    description: string;

    @ApiProperty({
        description: 'Orçamento disponível (em reais)',
        example: 5000.00,
        minimum: 0,
    })
    @IsNumber({}, { message: 'O orçamento deve ser um número' })
    @IsPositive({ message: 'O orçamento deve ser um valor positivo' })
    @IsNotEmpty({ message: 'O orçamento é obrigatório' })
    budget: number;

    @ApiProperty({
        description: 'Localização do serviço',
        example: 'São Paulo, SP',
        minLength: 3,
        maxLength: 100,
    })
    @IsString({ message: 'A localização deve ser uma string' })
    @IsNotEmpty({ message: 'A localização é obrigatória' })
    @MinLength(3, { message: 'A localização deve ter no mínimo 3 caracteres' })
    @MaxLength(100, { message: 'A localização deve ter no máximo 100 caracteres' })
    location: string;
}
