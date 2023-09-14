import { Module } from '@nestjs/common';
import { DocumentModelService } from './document-model.service';
import { DocumentModelController } from './document-model.controller';

@Module({
  controllers: [DocumentModelController],
  providers: [DocumentModelService],
})
export class DocumentModelModule {}
