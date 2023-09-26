import { Module } from '@nestjs/common';
import { DocumentCategoryService } from './document-category.service';
import { DocumentCategoryController } from './document-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModel } from '../document-model/entities/document-model.entity';
import { User } from '../users/entities/user.entity';
import { Category } from './entities/document-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentModel, User, Category])],
  controllers: [DocumentCategoryController],
  providers: [DocumentCategoryService],
})
export class DocumentCategoryModule {}
