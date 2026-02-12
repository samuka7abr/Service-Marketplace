import { Module } from '@nestjs/common';
import { DynamoModule } from '../../database/dynamo.module';

// Repositories
import { RequestRepository } from './infrastructure/repositories/request.repository';

// Use Cases
import { CreateRequestUseCase } from './application/use-cases/create-request.use-case';
import { GetRequestByIdUseCase } from './application/use-cases/get-request-by-id.use-case';
import { GetRequestsByClientIdUseCase } from './application/use-cases/get-requests-by-client-id.use-case';
import { GetRequestsByServiceIdUseCase } from './application/use-cases/get-requests-by-service-id.use-case';
import { GetRequestsByStatusUseCase } from './application/use-cases/get-requests-by-status.use-case';
import { GetAllRequestsUseCase } from './application/use-cases/get-all-requests.use-case';
import { UpdateRequestUseCase } from './application/use-cases/update-request.use-case';
import { DeleteRequestUseCase } from './application/use-cases/delete-request.use-case';

// Controllers
import { RequestsController } from './presentation/controllers/requests.controller';

@Module({
    imports: [DynamoModule],
    controllers: [RequestsController],
    providers: [
        // Repository
        {
            provide: 'IRequestRepository',
            useClass: RequestRepository,
        },
        // Use Cases
        CreateRequestUseCase,
        GetRequestByIdUseCase,
        GetRequestsByClientIdUseCase,
        GetRequestsByServiceIdUseCase,
        GetRequestsByStatusUseCase,
        GetAllRequestsUseCase,
        UpdateRequestUseCase,
        DeleteRequestUseCase,
    ],
    exports: [
        'IRequestRepository',
        GetRequestByIdUseCase,
        GetRequestsByClientIdUseCase,
        GetRequestsByServiceIdUseCase,
    ],
})
export class RequestsModule {}
