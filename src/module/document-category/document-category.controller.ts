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
  Query,
} from '@nestjs/common';
import { DocumentCategoryService } from './document-category.service';
import { DocumentCategory } from './entities/document-category.entity';
import { CreateCategoryDto } from './dto/create-document-category.dto';
import { UpdateCategoryDto } from './dto/update-document-category.dto';
import { AuthGuard } from '../users/guard/auth.guard';
import { Request } from 'express';

@Controller('document/category')
export class DocumentCategoryController {
  constructor(
    private readonly documentCategoryService: DocumentCategoryService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/user')
  async getAllUserCategories(
    @Req() request: Request,
  ): Promise<DocumentCategory[]> {
    const id = request['user'].sub;
    return this.documentCategoryService.getAllUserCategories(+id);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getAllCategories(): Promise<DocumentCategory[]> {
    return this.documentCategoryService.getAllCategories();
  }

  @UseGuards(AuthGuard)
  @Get('search')
  async searchCategories(
    @Query('name') name: string,
  ): Promise<{ id: number; name: string }[]> {
    return this.documentCategoryService.searchCategoriesByName(name);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getCategoryById(@Param('id') id: number): Promise<DocumentCategory> {
    return this.documentCategoryService.getCategoryById(+id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() request: Request,
  ): Promise<DocumentCategory> {
    const id = request['user'].sub;
    return this.documentCategoryService.createCategory(+id, createCategoryDto);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<DocumentCategory> {
    return this.documentCategoryService.updateCategory(+id, updateCategoryDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<void> {
    return this.documentCategoryService.deleteCategory(id);
  }
}
