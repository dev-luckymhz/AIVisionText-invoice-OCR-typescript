import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(
    search: string,
    page: number = 1,
    limit: number = 10,
    sort: string = 'id',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<[Product[], number]> {
    let query: SelectQueryBuilder<Product> =
      this.productRepository.createQueryBuilder('product');

    if (search) {
      query = query.where('product.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    query = query
      .leftJoinAndSelect('product.invoice', 'invoice')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`product.${sort}`, order);

    return await query.getManyAndCount();
  }

  async create(productData: any): Promise<Product> {
    const product = new Product();
    product.name = productData.name;
    product.price = productData.price;
    product.qty = productData.qty;
    return await this.productRepository.save(product);
  }

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id: id },
      relations: ['invoice'],
    });
  }

  async update(id: number, productData: any): Promise<Product> {
    await this.productRepository.update(id, productData);
    return this.productRepository.findOne({ where: { id: id } });
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
