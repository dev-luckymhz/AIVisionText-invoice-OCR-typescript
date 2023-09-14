import { Module } from '@nestjs/common';
import { DocumentModelService } from './document-model.service';
import { DocumentModelController } from './document-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModel } from './entities/document-model.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentModel, User])],
  controllers: [DocumentModelController],
  providers: [DocumentModelService],
})
export class DocumentModelModule {}
