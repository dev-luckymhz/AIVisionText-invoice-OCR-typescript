import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DocumentCategoryService } from './document-category.service';
import { Category } from './entities/document-category.entity';
import { CreateCategoryDto } from './dto/create-document-category.dto';
import { UpdateCategoryDto } from './dto/update-document-category.dto';
import { AuthGuard } from '../users/guard/auth.guard';
import { Request } from 'express';

@Controller('document-category')
export class DocumentCategoryController {
  constructor(
    private readonly documentCategoryService: DocumentCategoryService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllCategories(@Req() request: Request): Promise<Category[]> {
    const id = request['user'].sub;
    return this.documentCategoryService.getAllCategories(+id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getCategoryById(@Param('id') id: number): Promise<Category> {
    return this.documentCategoryService.getCategoryById(+id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() request: Request,
  ): Promise<Category> {
    const id = request['user'].sub;
    return this.documentCategoryService.createCategory(+id, createCategoryDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.documentCategoryService.updateCategory(+id, updateCategoryDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return this.documentCategoryService.deleteCategory(id);
  }
}
