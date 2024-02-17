import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import PhotosController from './photos.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
