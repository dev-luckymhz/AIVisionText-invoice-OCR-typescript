import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
    @Query('order') order: 'ASC' | 'DESC',
  ): Promise<[Product[], number]> {
    return this.productService.findAll(search, page, limit, sort, order);
  }

  @Post()
  create(@Body() productData: any): Promise<Product> {
    return this.productService.create(productData);
  }
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() productData: any): Promise<Product> {
    return this.productService.update(id, productData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
