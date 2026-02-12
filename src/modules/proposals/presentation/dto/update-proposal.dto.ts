import { IsString, IsNumber, IsPositive, IsOptional, IsEnum, MinLength, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProposalStatus } from '../../domain/entities/proposal.entity';

export class UpdateProposalDto {
    @ApiProperty({
        description: 'Valor da proposta (em reais)',
        example: 4500.00,
        required: false,
        minimum: 0,
    })
    @IsOptional()
    @IsNumber({}, { message: 'O valor deve ser um número' })
    @IsPositive({ message: 'O valor deve ser positivo' })
    amount?: number;

    @ApiProperty({
        description: 'Prazo de entrega (em dias)',
        example: 15,
        required: false,
        minimum: 1,
    })
    @IsOptional()
    @IsNumber({}, { message: 'O prazo deve ser um número' })
    @Min(1, { message: 'O prazo deve ser de no mínimo 1 dia' })
    deliveryTime?: number;

    @ApiProperty({
        description: 'Descrição da proposta',
        example: 'Posso entregar um site responsivo com 5 páginas em 15 dias',
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
        description: 'Status da proposta',
        example: ProposalStatus.ACCEPTED,
        enum: ProposalStatus,
        required: false,
    })
    @IsOptional()
    @IsEnum(ProposalStatus, { message: 'Status inválido' })
    status?: ProposalStatus;
}
