import { ApiProperty } from '@nestjs/swagger';
import { Request, RequestStatus } from '../../domain/entities/request.entity';

export class RequestResponseDto {
    @ApiProperty({
        description: 'UUID da solicitação',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    uuid: string;

    @ApiProperty({
        description: 'UUID do cliente',
        example: '550e8400-e29b-41d4-a716-446655440001',
    })
    clientId: string;

    @ApiProperty({
        description: 'UUID do serviço',
        example: '550e8400-e29b-41d4-a716-446655440002',
    })
    serviceId: string;

    @ApiProperty({
        description: 'Título da solicitação',
        example: 'Preciso de um site para minha empresa',
    })
    title: string;

    @ApiProperty({
        description: 'Descrição detalhada',
        example: 'Preciso de um site institucional com 5 páginas',
    })
    description: string;

    @ApiProperty({
        description: 'Orçamento disponível',
        example: 5000.00,
    })
    budget: number;

    @ApiProperty({
        description: 'Localização do serviço',
        example: 'São Paulo, SP',
    })
    location: string;

    @ApiProperty({
        description: 'Status da solicitação',
        enum: RequestStatus,
        example: RequestStatus.OPEN,
    })
    status: RequestStatus;

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

    static fromEntity(request: Request): RequestResponseDto {
        return {
            uuid: request.uuid,
            clientId: request.clientId,
            serviceId: request.serviceId,
            title: request.title,
            description: request.description,
            budget: request.budget,
            location: request.location,
            status: request.status,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
        };
    }

    static fromEntities(requests: Request[]): RequestResponseDto[] {
        return requests.map((request) => this.fromEntity(request));
    }
}
