import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Invoice } from './entities/invoice.entity';
import { InvoiceDTO } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() invoiceData: InvoiceDTO): Promise<Invoice> {
    return this.invoiceService.create(invoiceData);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
    @Query('order') order: 'ASC' | 'DESC',
  ): Promise<[Invoice[], number]> {
    return this.invoiceService.findAll(search, page, limit, sort, order);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Invoice> {
    return await this.invoiceService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() invoiceData: InvoiceDTO,
  ): Promise<Invoice> {
    return this.invoiceService.update(id, invoiceData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.invoiceService.remove(id);
  }
}
