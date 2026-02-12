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
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { ServiceResponseDto } from '../dto/service-response.dto';

// Use Cases
import { CreateServiceUseCase } from '../../application/use-cases/create-service.use-case';
import { GetServiceByIdUseCase } from '../../application/use-cases/get-service-by-id.use-case';
import { GetServiceByNameUseCase } from '../../application/use-cases/get-service-by-name.use-case';
import { GetServicesByCategoryUseCase } from '../../application/use-cases/get-services-by-category.use-case';
import { GetAllServicesUseCase } from '../../application/use-cases/get-all-services.use-case';
import { GetAllActiveServicesUseCase } from '../../application/use-cases/get-all-active-services.use-case';
import { UpdateServiceUseCase } from '../../application/use-cases/update-service.use-case';
import { DeleteServiceUseCase } from '../../application/use-cases/delete-service.use-case';

@ApiTags('Serviços')
@Controller('services')
export class ServicesController {
    constructor(
        private createServiceUseCase: CreateServiceUseCase,
        private getServiceByIdUseCase: GetServiceByIdUseCase,
        private getServiceByNameUseCase: GetServiceByNameUseCase,
        private getServicesByCategoryUseCase: GetServicesByCategoryUseCase,
        private getAllServicesUseCase: GetAllServicesUseCase,
        private getAllActiveServicesUseCase: GetAllActiveServicesUseCase,
        private updateServiceUseCase: UpdateServiceUseCase,
        private deleteServiceUseCase: DeleteServiceUseCase,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar um novo serviço' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Serviço criado com sucesso',
        type: ServiceResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.CONFLICT,
        description: 'Já existe um serviço com este nome',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Dados inválidos',
    })
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createServiceDto: CreateServiceDto,
    ): Promise<ServiceResponseDto> {
        const service = await this.createServiceUseCase.execute(
            createServiceDto.name,
            createServiceDto.description,
            createServiceDto.category,
        );
        return ServiceResponseDto.fromEntity(service);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os serviços' })
    @ApiQuery({
        name: 'active',
        required: false,
        type: Boolean,
        description: 'Filtrar apenas serviços ativos',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de serviços',
        type: [ServiceResponseDto],
    })
    async findAll(
        @Query('active') active?: string,
    ): Promise<ServiceResponseDto[]> {
        const isActive = active === 'true';
        const services = isActive
            ? await this.getAllActiveServicesUseCase.execute()
            : await this.getAllServicesUseCase.execute();

        return ServiceResponseDto.fromEntities(services);
    }

    @Get('category/:category')
    @ApiOperation({ summary: 'Buscar serviços por categoria' })
    @ApiParam({
        name: 'category',
        description: 'Categoria dos serviços',
        example: 'Tecnologia',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Lista de serviços da categoria',
        type: [ServiceResponseDto],
    })
    async findByCategory(
        @Param('category') category: string,
    ): Promise<ServiceResponseDto[]> {
        const services =
            await this.getServicesByCategoryUseCase.execute(category);
        return ServiceResponseDto.fromEntities(services);
    }

    @Get('name/:name')
    @ApiOperation({ summary: 'Buscar serviço por nome' })
    @ApiParam({
        name: 'name',
        description: 'Nome do serviço',
        example: 'Desenvolvimento de Software',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Serviço encontrado',
        type: ServiceResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Serviço não encontrado',
    })
    async findByName(@Param('name') name: string): Promise<ServiceResponseDto> {
        const service = await this.getServiceByNameUseCase.execute(name);
        return ServiceResponseDto.fromEntity(service);
    }

    @Get(':uuid')
    @ApiOperation({ summary: 'Buscar serviço por UUID' })
    @ApiParam({
        name: 'uuid',
        description: 'UUID do serviço',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Serviço encontrado',
        type: ServiceResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Serviço não encontrado',
    })
    async findById(@Param('uuid') uuid: string): Promise<ServiceResponseDto> {
        const service = await this.getServiceByIdUseCase.execute(uuid);
        return ServiceResponseDto.fromEntity(service);
    }

    @Put(':uuid')
    @ApiOperation({ summary: 'Atualizar um serviço' })
    @ApiParam({
        name: 'uuid',
        description: 'UUID do serviço',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Serviço atualizado com sucesso',
        type: ServiceResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Serviço não encontrado',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Dados inválidos',
    })
    async update(
        @Param('uuid') uuid: string,
        @Body() updateServiceDto: UpdateServiceDto,
    ): Promise<ServiceResponseDto> {
        const service = await this.updateServiceUseCase.execute(
            uuid,
            updateServiceDto.name,
            updateServiceDto.description,
            updateServiceDto.category,
            updateServiceDto.isActive,
        );
        return ServiceResponseDto.fromEntity(service);
    }

    @Delete(':uuid')
    @ApiOperation({ summary: 'Deletar um serviço' })
    @ApiParam({
        name: 'uuid',
        description: 'UUID do serviço',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Serviço deletado com sucesso',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Serviço não encontrado',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('uuid') uuid: string): Promise<void> {
        await this.deleteServiceUseCase.execute(uuid);
    }
}
