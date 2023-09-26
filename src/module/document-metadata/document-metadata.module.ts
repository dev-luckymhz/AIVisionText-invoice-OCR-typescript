import { Module } from '@nestjs/common';
import { DocumentMetadataService } from './document-metadata.service';
import { DocumentMetadataController } from './document-metadata.controller';

@Module({
  controllers: [DocumentMetadataController],
  providers: [DocumentMetadataService],
})
export class DocumentMetadataModule {}
