import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { DocumentCategory } from './entities/document-category.entity';

@Injectable()
export class DocumentCategoryService {
  constructor(
    @InjectRepository(DocumentCategory)
    private categoryRepository: Repository<DocumentCategory>,
  ) {}

  async createCategory(
    userId: number,
    categoryData: Partial<DocumentCategory>,
  ): Promise<DocumentCategory> {
    const category = this.categoryRepository.create({
      ...categoryData,
      user: { id: userId }, // Associate the category with the user
    });
    return this.categoryRepository.save(category);
  }

  async getCategoryById(id: number): Promise<DocumentCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async searchCategoriesByName(
    name = '',
  ): Promise<{ id: number; name: string }[]> {
    return this.categoryRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
      take: 5,
      select: ['id', 'name'] as (keyof DocumentCategory)[],
    });
  }

  async updateCategory(
    id: number,
    categoryData: Partial<DocumentCategory>,
  ): Promise<DocumentCategory> {
    const category = await this.getCategoryById(id);
    this.categoryRepository.merge(category, categoryData);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.getCategoryById(id);
    await this.categoryRepository.remove(category);
  }

  async getAllUserCategories(userId: number): Promise<DocumentCategory[]> {
    return this.categoryRepository.find({ where: { user: { id: userId } } });
  }

  async getAllCategories(): Promise<DocumentCategory[]> {
    return this.categoryRepository.find();
  }
}
