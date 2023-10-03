import { Module } from '@nestjs/common';
import { DocumentMetadataService } from './document-metadata.service';
import { DocumentMetadataController } from './document-metadata.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModel } from '../document-model/entities/document-model.entity';
import { User } from '../users/entities/user.entity';
import { DocumentMetadatum } from './entities/document-metadatum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentModel, User, DocumentMetadatum])],
  controllers: [DocumentMetadataController],
  providers: [DocumentMetadataService],
})
export class DocumentMetadataModule {}
