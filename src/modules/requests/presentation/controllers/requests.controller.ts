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
import { CreateRequestDto } from '../dto/create-request.dto';
import { UpdateRequestDto } from '../dto/update-request.dto';
import { RequestResponseDto } from '../dto/request-response.dto';

// Use Cases
import { CreateRequestUseCase } from '../../application/use-cases/create-request.use-case';
import { GetRequestByIdUseCase } from '../../application/use-cases/get-request-by-id.use-case';
import { GetRequestsByClientIdUseCase } from '../../application/use-cases/get-requests-by-client-id.use-case';
import { GetRequestsByServiceIdUseCase } from '../../application/use-cases/get-requests-by-service-id.use-case';
import { GetRequestsByStatusUseCase } from '../../application/use-cases/get-requests-by-status.use-case';
import { GetAllRequestsUseCase } from '../../application/use-cases/get-all-requests.use-case';
import { UpdateRequestUseCase } from '../../application/use-cases/update-request.use-case';
import { DeleteRequestUseCase } from '../../application/use-cases/delete-request.use-case';

@ApiTags('Solicitações')
@Controller('requests')
export class RequestsController {
    constructor(
        private createRequestUseCase: CreateRequestUseCase,
        private getRequestByIdUseCase: GetRequestByIdUseCase,
        private getRequestsByClientIdUseCase: GetRequestsByClientIdUseCase,
        private getRequestsByServiceIdUseCase: GetRequestsByServiceIdUseCase,
        private getRequestsByStatusUseCase: GetRequestsByStatusUseCase,
        private getAllRequestsUseCase: GetAllRequestsUseCase,
        private updateRequestUseCase: UpdateRequestUseCase,
        private deleteRequestUseCase: DeleteRequestUseCase,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar uma nova solicitação' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Solicitação criada com sucesso',
        type: RequestResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Dados inválidos',
    })
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createRequestDto: CreateRequestDto,
    ): Promise<RequestResponseDto> {
        const request = await this.createRequestUseCase.execute(
            createRequestDto.clientId,
            createRequestDto.serviceId,
            createRequestDto.title,
            createRequestDto.description,
            createRequestDto.budget,
            createRequestDto.location,
        );
        return RequestResponseDto.fromEntity(request);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as solicitações' })
    @ApiQuery({
        name: 'status',
        required: false,
        type: String,
        description: 'Filtrar por status (OPEN, IN_NEGOTIATION, CLOSED, CANCELLED)',
    })
    @ApiQuery({
        name: 'clientId',
        required: false,
        type: String,
        description: 'Filtrar por cliente',
    })
    @ApiQuery({
        name: 'serviceId',
        required: false,
        type: String,
        description: 'Filtrar por serviço',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de solicitações',
        type: [RequestResponseDto],
    })
    async findAll(
        @Query('status') status?: string,
        @Query('clientId') clientId?: string,
        @Query('serviceId') serviceId?: string,
    ): Promise<RequestResponseDto[]> {
        let requests;

        if (status) {
            requests = await this.getRequestsByStatusUseCase.execute(status);
        } else if (clientId) {
            requests = await this.getRequestsByClientIdUseCase.execute(clientId);
        } else if (serviceId) {
            requests =
                await this.getRequestsByServiceIdUseCase.execute(serviceId);
        } else {
            requests = await this.getAllRequestsUseCase.execute();
        }

        return RequestResponseDto.fromEntities(requests);
    }

    @Get(':uuid')
    @ApiOperation({ summary: 'Buscar solicitação por UUID' })
    @ApiParam({
        name: 'uuid',
        description: 'UUID da solicitação',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Solicitação encontrada',
        type: RequestResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Solicitação não encontrada',
    })
    async findById(@Param('uuid') uuid: string): Promise<RequestResponseDto> {
        const request = await this.getRequestByIdUseCase.execute(uuid);
        return RequestResponseDto.fromEntity(request);
    }

    @Put(':uuid')
    @ApiOperation({ summary: 'Atualizar uma solicitação' })
    @ApiParam({
        name: 'uuid',
        description: 'UUID da solicitação',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Solicitação atualizada com sucesso',
        type: RequestResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Solicitação não encontrada',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Dados inválidos',
    })
    async update(
        @Param('uuid') uuid: string,
        @Body() updateRequestDto: UpdateRequestDto,
    ): Promise<RequestResponseDto> {
        const request = await this.updateRequestUseCase.execute(
            uuid,
            updateRequestDto.title,
            updateRequestDto.description,
            updateRequestDto.budget,
            updateRequestDto.location,
            updateRequestDto.status,
        );
        return RequestResponseDto.fromEntity(request);
    }

    @Delete(':uuid')
    @ApiOperation({ summary: 'Deletar uma solicitação' })
    @ApiParam({
        name: 'uuid',
        description: 'UUID da solicitação',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Solicitação deletada com sucesso',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Solicitação não encontrada',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('uuid') uuid: string): Promise<void> {
        await this.deleteRequestUseCase.execute(uuid);
    }
}
