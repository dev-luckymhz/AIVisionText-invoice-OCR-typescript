import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Product } from './product/entities/product.entity';
import { InvoiceDTO } from './dto/create-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(invoiceData: InvoiceDTO): Promise<Invoice> {
    const invoice = new Invoice();

    invoice.InvNo = invoiceData.InvNo;
    invoice.customerName = invoiceData.customerName;
    invoice.address = invoiceData.address;
    invoice.email = invoiceData.email;
    invoice.contactNo = invoiceData.contactNo;
    invoice.additionalDetails = invoiceData.additionalDetails;

    invoice.products = invoiceData.products.map((prodData) => {
      const product = new Product();
      product.name = prodData.name;
      product.price = prodData.price;
      product.qty = prodData.qty;
      return product;
    });

    return await this.invoiceRepository.save(invoice);
  }

  async findAll(
    search: string,
    page: number = 1,
    limit: number = 10,
    sort: string = 'id',
    order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<[any[], number]> {
    // Change to any[] to include total
    let query: SelectQueryBuilder<Invoice> = this.invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.products', 'product')
      .loadRelationCountAndMap('invoice.productCount', 'invoice.products');

    if (search) {
      query = query
        .where('invoice.customerName LIKE :search', { search: `%${search}%` })
        .orWhere('product.name LIKE :search', { search: `%${search}%` });
    }

    query = query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`invoice.${sort}`, order);

    const [invoices, count] = await query.getManyAndCount();

    // Calculate total for each invoice
    const invoicesWithTotal = invoices.map((invoice) => {
      const total = invoice.products.reduce((sum, product) => {
        return sum + parseFloat(product.price.toString()) * product.qty;
      }, 0);
      return { ...invoice, total };
    });
    return [invoicesWithTotal, count];
  }

  async update(id: number, invoiceData: InvoiceDTO): Promise<Invoice> {
    await this.invoiceRepository.update(id, invoiceData);
    return await this.findOne(id);
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: id },
      relations: ['products'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found.`);
    }

    return invoice;
  }

  async remove(id: number): Promise<void> {
    await this.invoiceRepository.delete(id);
  }
}
