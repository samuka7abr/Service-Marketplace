import { Module } from '@nestjs/common';
import { DynamoModule } from '../../database/dynamo.module';

// Repositories
import { ProposalRepository } from './infrastructure/repositories/proposal.repository';

// Use Cases
import { CreateProposalUseCase } from './application/use-cases/create-proposal.use-case';
import { GetProposalByIdUseCase } from './application/use-cases/get-proposal-by-id.use-case';
import { GetProposalsByRequestIdUseCase } from './application/use-cases/get-proposals-by-request-id.use-case';
import { GetProposalsByProviderIdUseCase } from './application/use-cases/get-proposals-by-provider-id.use-case';
import { GetProposalsByStatusUseCase } from './application/use-cases/get-proposals-by-status.use-case';
import { GetAllProposalsUseCase } from './application/use-cases/get-all-proposals.use-case';
import { UpdateProposalUseCase } from './application/use-cases/update-proposal.use-case';
import { DeleteProposalUseCase } from './application/use-cases/delete-proposal.use-case';

// Controllers
import { ProposalsController } from './presentation/controllers/proposals.controller';

@Module({
    imports: [DynamoModule],
    controllers: [ProposalsController],
    providers: [
        // Repository
        {
            provide: 'IProposalRepository',
            useClass: ProposalRepository,
        },
        // Use Cases
        CreateProposalUseCase,
        GetProposalByIdUseCase,
        GetProposalsByRequestIdUseCase,
        GetProposalsByProviderIdUseCase,
        GetProposalsByStatusUseCase,
        GetAllProposalsUseCase,
        UpdateProposalUseCase,
        DeleteProposalUseCase,
    ],
    exports: [
        'IProposalRepository',
        GetProposalByIdUseCase,
        GetProposalsByRequestIdUseCase,
    ],
})
export class ProposalsModule {}
