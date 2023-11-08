import { Module } from '@nestjs/common';
import { DocumentModelService } from './document-model.service';
import { DocumentModelController } from './document-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModel } from './entities/document-model.entity';
import { User } from '../users/entities/user.entity';
import { ExtractedDatum } from '../extracted-data/entities/extracted-datum.entity';
import { DataCleaningService } from './data-cleaning.service';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Contract } from '../contract/entities/contract.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentModel,
      User,
      ExtractedDatum,
      Invoice,
      Contract,
    ]),
  ],
  controllers: [DocumentModelController],
  providers: [DocumentModelService, DataCleaningService],
})
export class DocumentModelModule {}
