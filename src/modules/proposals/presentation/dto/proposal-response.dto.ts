import { ApiProperty } from '@nestjs/swagger';
import { Proposal, ProposalStatus } from '../../domain/entities/proposal.entity';

export class ProposalResponseDto {
    @ApiProperty({
        description: 'UUID da proposta',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    uuid: string;

    @ApiProperty({
        description: 'UUID da solicitação',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    requestId: string;

    @ApiProperty({
        description: 'UUID do prestador',
        example: '550e8400-e29b-41d4-a716-446655440002',
    })
    providerId: string;

    @ApiProperty({
        description: 'Valor da proposta',
        example: 4500.00,
    })
    amount: number;

    @ApiProperty({
        description: 'Prazo de entrega (em dias)',
        example: 15,
    })
    deliveryTime: number;

    @ApiProperty({
        description: 'Descrição da proposta',
        example: 'Posso entregar um site responsivo com 5 páginas em 15 dias',
    })
    description: string;

    @ApiProperty({
        description: 'Status da proposta',
        enum: ProposalStatus,
        example: ProposalStatus.PENDING,
    })
    status: ProposalStatus;

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

    static fromEntity(proposal: Proposal): ProposalResponseDto {
        return {
            uuid: proposal.uuid,
            requestId: proposal.requestId,
            providerId: proposal.providerId,
            amount: proposal.amount,
            deliveryTime: proposal.deliveryTime,
            description: proposal.description,
            status: proposal.status,
            createdAt: proposal.createdAt,
            updatedAt: proposal.updatedAt,
        };
    }

    static fromEntities(proposals: Proposal[]): ProposalResponseDto[] {
        return proposals.map((proposal) => this.fromEntity(proposal));
    }
}
