import { Module } from '@nestjs/common';
import { DocumentModelService } from './document-model.service';
import { DocumentModelController } from './document-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModel } from './entities/document-model.entity';
import { User } from '../users/entities/user.entity';
import { ExtractedDatum } from '../extracted-data/entities/extracted-datum.entity';
import { DataCleaningService } from './data-cleaning.service';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentModel, User, ExtractedDatum])],
  controllers: [DocumentModelController],
  providers: [DocumentModelService, DataCleaningService],
})
export class DocumentModelModule {}
