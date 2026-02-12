import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DynamoModule } from '../../database/dynamo.module';

// Repositories
import { MediaRepository } from './infrastructure/repositories/media.repository';

// Services
import { S3Service } from './infrastructure/services/s3.service';
import { MediaValidationService } from './infrastructure/services/media-validation.service';

// Use Cases
import { UploadMediaUseCase } from './application/use-cases/upload-media.use-case';
import { ListMediaUseCase } from './application/use-cases/list-media.use-case';
import { DeleteMediaUseCase } from './application/use-cases/delete-media.use-case';

// Controllers
import { MediaController } from './presentation/controllers/media.controller';

@Module({
    imports: [DynamoModule, ConfigModule],
    controllers: [MediaController],
    providers: [
        // Repository
        {
            provide: 'IMediaRepository',
            useClass: MediaRepository,
        },
        // Services
        {
            provide: 'IS3Service',
            useClass: S3Service,
        },
        MediaValidationService,
        // Use Cases
        UploadMediaUseCase,
        ListMediaUseCase,
        DeleteMediaUseCase,
    ],
    exports: [
        'IMediaRepository',
        'IS3Service',
        UploadMediaUseCase,
        ListMediaUseCase,
    ],
})
export class MediaModule {}
