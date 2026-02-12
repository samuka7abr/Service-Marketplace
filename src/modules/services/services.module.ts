import { Module } from '@nestjs/common';
import { DynamoModule } from '../../database/dynamo.module';

// Repositories
import { ServiceRepository } from './infrastructure/repositories/service.repository';

// Use Cases
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case';
import { GetServiceByIdUseCase } from './application/use-cases/get-service-by-id.use-case';
import { GetServiceByNameUseCase } from './application/use-cases/get-service-by-name.use-case';
import { GetServicesByCategoryUseCase } from './application/use-cases/get-services-by-category.use-case';
import { GetAllServicesUseCase } from './application/use-cases/get-all-services.use-case';
import { GetAllActiveServicesUseCase } from './application/use-cases/get-all-active-services.use-case';
import { UpdateServiceUseCase } from './application/use-cases/update-service.use-case';
import { DeleteServiceUseCase } from './application/use-cases/delete-service.use-case';

// Controllers
import { ServicesController } from './presentation/controllers/services.controller';

@Module({
    imports: [DynamoModule],
    controllers: [ServicesController],
    providers: [
        // Repository
        {
            provide: 'IServiceRepository',
            useClass: ServiceRepository,
        },
        // Use Cases
        CreateServiceUseCase,
        GetServiceByIdUseCase,
        GetServiceByNameUseCase,
        GetServicesByCategoryUseCase,
        GetAllServicesUseCase,
        GetAllActiveServicesUseCase,
        UpdateServiceUseCase,
        DeleteServiceUseCase,
    ],
    exports: [
        'IServiceRepository',
        GetServiceByIdUseCase,
        GetServiceByNameUseCase,
        GetServicesByCategoryUseCase,
        GetAllServicesUseCase,
        GetAllActiveServicesUseCase,
    ],
})
export class ServicesModule {}
