import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';

// DTOs
import { CreateProposalDto } from '../dto/create-proposal.dto';
import { UpdateProposalDto } from '../dto/update-proposal.dto';
import { ProposalResponseDto } from '../dto/proposal-response.dto';

// Use Cases
import { CreateProposalUseCase } from '../../application/use-cases/create-proposal.use-case';
import { GetProposalByIdUseCase } from '../../application/use-cases/get-proposal-by-id.use-case';
import { GetProposalsByRequestIdUseCase } from '../../application/use-cases/get-proposals-by-request-id.use-case';
import { GetProposalsByProviderIdUseCase } from '../../application/use-cases/get-proposals-by-provider-id.use-case';
import { GetProposalsByStatusUseCase } from '../../application/use-cases/get-proposals-by-status.use-case';
import { GetAllProposalsUseCase } from '../../application/use-cases/get-all-proposals.use-case';
import { UpdateProposalUseCase } from '../../application/use-cases/update-proposal.use-case';
import { DeleteProposalUseCase } from '../../application/use-cases/delete-proposal.use-case';

@ApiTags('Propostas')
@Controller('proposals')
export class ProposalsController {
    constructor(
        private createProposalUseCase: CreateProposalUseCase,
        private getProposalByIdUseCase: GetProposalByIdUseCase,
        private getProposalsByRequestIdUseCase: GetProposalsByRequestIdUseCase,
        private getProposalsByProviderIdUseCase: GetProposalsByProviderIdUseCase,
        private getProposalsByStatusUseCase: GetProposalsByStatusUseCase,
        private getAllProposalsUseCase: GetAllProposalsUseCase,
        private updateProposalUseCase: UpdateProposalUseCase,
        private deleteProposalUseCase: DeleteProposalUseCase,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar uma nova proposta' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Proposta criada com sucesso',
        type: ProposalResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Dados inválidos',
    })
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createProposalDto: CreateProposalDto,
    ): Promise<ProposalResponseDto> {
        const proposal = await this.createProposalUseCase.execute(
            createProposalDto.requestId,
            createProposalDto.providerId,
            createProposalDto.amount,
            createProposalDto.deliveryTime,
            createProposalDto.description,
        );
        return ProposalResponseDto.fromEntity(proposal);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as propostas' })
    @ApiQuery({
        name: 'status',
        required: false,
        type: String,
        description: 'Filtrar por status (PENDING, ACCEPTED, REJECTED, WITHDRAWN)',
    })
    @ApiQuery({
        name: 'requestId',
        required: false,
        type: String,
        description: 'Filtrar por solicitação',
    })
    @ApiQuery({
        name: 'providerId',
        required: false,
        type: String,
        description: 'Filtrar por prestador',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de propostas',
        type: [ProposalResponseDto],
    })
    async findAll(
        @Query('status') status?: string,
        @Query('requestId') requestId?: string,
        @Query('providerId') providerId?: string,
    ): Promise<ProposalResponseDto[]> {
        let proposals;

        if (status) {
            proposals = await this.getProposalsByStatusUseCase.execute(status);
        } else if (requestId) {
            proposals =
                await this.getProposalsByRequestIdUseCase.execute(requestId);
        } else if (providerId) {
            proposals =
                await this.getProposalsByProviderIdUseCase.execute(providerId);
        } else {
            proposals = await this.getAllProposalsUseCase.execute();
        }

        return ProposalResponseDto.fromEntities(proposals);
    }

    @Get(':uuid')
    @ApiOperation({ summary: 'Buscar proposta por UUID' })
    @ApiParam({
        name: 'uuid',
        description: 'UUID da proposta',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Proposta encontrada',
        type: ProposalResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Proposta não encontrada',
    })
    async findById(@Param('uuid') uuid: string): Promise<ProposalResponseDto> {
        const proposal = await this.getProposalByIdUseCase.execute(uuid);
        return ProposalResponseDto.fromEntity(proposal);
    }

    @Put(':uuid')
    @ApiOperation({ summary: 'Atualizar uma proposta' })
    @ApiParam({
        name: 'uuid',
        description: 'UUID da proposta',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Proposta atualizada com sucesso',
        type: ProposalResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Proposta não encontrada',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Dados inválidos',
    })
    async update(
        @Param('uuid') uuid: string,
        @Body() updateProposalDto: UpdateProposalDto,
    ): Promise<ProposalResponseDto> {
        const proposal = await this.updateProposalUseCase.execute(
            uuid,
            updateProposalDto.amount,
            updateProposalDto.deliveryTime,
            updateProposalDto.description,
            updateProposalDto.status,
        );
        return ProposalResponseDto.fromEntity(proposal);
    }

    @Delete(':uuid')
    @ApiOperation({ summary: 'Deletar uma proposta' })
    @ApiParam({
        name: 'uuid',
        description: 'UUID da proposta',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Proposta deletada com sucesso',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Proposta não encontrada',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('uuid') uuid: string): Promise<void> {
        await this.deleteProposalUseCase.execute(uuid);
    }
}
