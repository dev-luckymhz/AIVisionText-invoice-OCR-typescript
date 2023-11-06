import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Product } from './product/entities/product.entity';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports: [TypeOrmModule.forFeature([Invoice, Product]), ProductModule],
})
export class InvoiceModule {}
