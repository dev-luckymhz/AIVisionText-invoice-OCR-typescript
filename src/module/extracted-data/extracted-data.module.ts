import { Module } from '@nestjs/common';
import { ExtractedDataService } from './extracted-data.service';
import { ExtractedDataController } from './extracted-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModel } from '../document-model/entities/document-model.entity';
import { ExtractedDatum } from './entities/extracted-datum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentModel, ExtractedDatum])],
  controllers: [ExtractedDataController],
  providers: [ExtractedDataService],
})
export class ExtractedDataModule {}
