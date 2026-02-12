import { Media } from '../entities/media.entity';

export interface IMediaRepository {
    create(media: Media): Promise<void>;
    findById(uuid: string): Promise<Media | null>;
    findByUserId(userId: string, limit?: number, lastKey?: string): Promise<{ items: Media[]; lastKey?: string }>;
    findByRequestId(requestId: string): Promise<Media[]>;
    delete(uuid: string): Promise<void>;
    countByUserId(userId: string): Promise<number>;
}
