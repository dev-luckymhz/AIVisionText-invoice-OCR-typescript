import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from '../entities/invoice.entity';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Product])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
