import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../../domain/entities/service.entity';

export class ServiceResponseDto {
    @ApiProperty({
        description: 'UUID do serviço',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    uuid: string;

    @ApiProperty({
        description: 'Nome do serviço',
        example: 'Desenvolvimento de Software',
    })
    name: string;

    @ApiProperty({
        description: 'Descrição do serviço',
        example: 'Desenvolvimento de aplicações web e mobile sob medida',
    })
    description: string;

    @ApiProperty({
        description: 'Categoria do serviço',
        example: 'Tecnologia',
    })
    category: string;

    @ApiProperty({
        description: 'Indica se o serviço está ativo',
        example: true,
    })
    isActive: boolean;

    @ApiProperty({
        description: 'Data de criação do serviço',
        example: '2026-02-11T12:00:00.000Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Data da última atualização do serviço',
        example: '2026-02-11T12:00:00.000Z',
    })
    updatedAt: Date;

    static fromEntity(service: Service): ServiceResponseDto {
        return {
            uuid: service.uuid,
            name: service.name,
            description: service.description,
            category: service.category,
            isActive: service.isActive,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt,
        };
    }

    static fromEntities(services: Service[]): ServiceResponseDto[] {
        return services.map((service) => this.fromEntity(service));
    }
}
