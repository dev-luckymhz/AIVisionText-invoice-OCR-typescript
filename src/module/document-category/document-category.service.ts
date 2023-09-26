import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/document-category.entity';

@Injectable()
export class DocumentCategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createCategory(
    userId: number,
    categoryData: Partial<Category>,
  ): Promise<Category> {
    const category = this.categoryRepository.create({
      ...categoryData,
      user: { id: userId }, // Associate the category with the user
    });
    return this.categoryRepository.save(category);
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategory(
    id: number,
    categoryData: Partial<Category>,
  ): Promise<Category> {
    const category = await this.getCategoryById(id);
    this.categoryRepository.merge(category, categoryData);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.getCategoryById(id);
    await this.categoryRepository.remove(category);
  }

  async getAllCategories(userId: number): Promise<Category[]> {
    return this.categoryRepository.find({ where: { user: { id: userId } } });
  }
}
