import { IsString, IsNotEmpty, IsNumber, IsPositive, MinLength, MaxLength, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProposalDto {
    @ApiProperty({
        description: 'UUID da solicitação',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID('4', { message: 'O requestId deve ser um UUID válido' })
    @IsNotEmpty({ message: 'O requestId é obrigatório' })
    requestId: string;

    @ApiProperty({
        description: 'UUID do prestador',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    @IsUUID('4', { message: 'O providerId deve ser um UUID válido' })
    @IsNotEmpty({ message: 'O providerId é obrigatório' })
    providerId: string;

    @ApiProperty({
        description: 'Valor da proposta (em reais)',
        example: 4500.00,
        minimum: 0,
    })
    @IsNumber({}, { message: 'O valor deve ser um número' })
    @IsPositive({ message: 'O valor deve ser positivo' })
    @IsNotEmpty({ message: 'O valor é obrigatório' })
    amount: number;

    @ApiProperty({
        description: 'Prazo de entrega (em dias)',
        example: 15,
        minimum: 1,
    })
    @IsNumber({}, { message: 'O prazo deve ser um número' })
    @Min(1, { message: 'O prazo deve ser de no mínimo 1 dia' })
    @IsNotEmpty({ message: 'O prazo é obrigatório' })
    deliveryTime: number;

    @ApiProperty({
        description: 'Descrição da proposta',
        example: 'Posso entregar um site responsivo com 5 páginas em 15 dias',
        minLength: 20,
        maxLength: 1000,
    })
    @IsString({ message: 'A descrição deve ser uma string' })
    @IsNotEmpty({ message: 'A descrição é obrigatória' })
    @MinLength(20, { message: 'A descrição deve ter no mínimo 20 caracteres' })
    @MaxLength(1000, { message: 'A descrição deve ter no máximo 1000 caracteres' })
    description: string;
}
