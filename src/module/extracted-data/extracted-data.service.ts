import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as ExcelJS from 'exceljs';
import { createObjectCsvWriter } from 'csv-writer';
import { Repository } from 'typeorm';
import { ExtractedDatum } from './entities/extracted-datum.entity'; // Import the ExtractedData entity
import { CreateExtractedDatumDto } from './dto/create-extracted-datum.dto';
import { UpdateExtractedDatumDto } from './dto/update-extracted-datum.dto';

@Injectable()
export class ExtractedDataService {
  constructor(
    @InjectRepository(ExtractedDatum)
    private readonly extractedDataRepository: Repository<ExtractedDatum>,
  ) {}

  async create(createExtractedDataDto: CreateExtractedDatumDto) {
    const extractedData = this.extractedDataRepository.create(
      createExtractedDataDto,
    );
    return await this.extractedDataRepository.save(extractedData);
  }

  async findAll() {
    return await this.extractedDataRepository.find();
  }

  async findOne(id: number) {
    const extractedData = await this.extractedDataRepository.findOne({
      where: { id },
    });
    if (!extractedData) {
      throw new NotFoundException(`ExtractedDatum with id ${id} not found`);
    }
    return extractedData;
  }

  async update(id: number, updateExtractedDataDto: UpdateExtractedDatumDto) {
    const existingExtractedData = await this.extractedDataRepository.findOne({
      where: { id },
    });
    if (!existingExtractedData) {
      throw new NotFoundException(`ExtractedDatum with id ${id} not found`);
    }

    // Update the extracted data entity with the values from the DTO
    this.extractedDataRepository.merge(
      existingExtractedData,
      updateExtractedDataDto,
    );

    return await this.extractedDataRepository.save(existingExtractedData);
  }

  async remove(id: number) {
    const extractedData = await this.extractedDataRepository.findOne({
      where: { id },
    });
    if (!extractedData) {
      throw new NotFoundException(`ExtractedDatum with id ${id} not found`);
    }

    await this.extractedDataRepository.remove(extractedData);
    return `ExtractedDatum with id ${id} has been removed`;
  }

  async validateAndCleanseData(
    createExtractedDataDto: CreateExtractedDatumDto,
  ) {
    // Perform data validation and cleansing here
    const { date, totalAmount } = createExtractedDataDto;

    // Validate date format (example: yyyy-MM-dd)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.toString())) {
      throw new BadRequestException('Invalid date format');
    }

    // Remove unnecessary whitespace from vendor name
    createExtractedDataDto.vendorName =
      createExtractedDataDto.vendorName.trim();

    // Standardize currency format (example: 1000.00)
    createExtractedDataDto.totalAmount = parseFloat(totalAmount.toFixed(2));

    return createExtractedDataDto;
  }

  async exportDataToExcel(): Promise<Buffer | ArrayBuffer> {
    // Fetch extracted data from the database or prepare it as needed
    const extractedData = await this.extractedDataRepository.find();

    // using 'exceljs':
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Extracted Data');

    // Add data to the worksheet
    worksheet.columns = [
      { header: 'Vendor Name', key: 'vendorName' },
      { header: 'Invoice Number', key: 'invoiceNumber' },
      { header: 'Date', key: 'date' },
      { header: 'Total Amount', key: 'totalAmount' },
    ];

    extractedData.forEach((data) => {
      worksheet.addRow(data); // Add each data record to the worksheet
    });

    // Generate Excel binary data
    return await workbook.xlsx.writeBuffer();
  }
  async transformDataToCsv(): Promise<string> {
    // Fetch extracted data from the database or prepare it as needed
    const extractedData = await this.extractedDataRepository.find();

    // Define CSV writer configuration
    const csvWriter = createObjectCsvWriter({
      path: 'extracted-data.csv', // Specify the CSV file path
      header: [
        { id: 'vendorName', title: 'Vendor Name' },
        { id: 'invoiceNumber', title: 'Invoice Number' },
        { id: 'date', title: 'Date' },
        { id: 'totalAmount', title: 'Total Amount' },
      ],
    });

    // Write data to the CSV file
    await csvWriter.writeRecords(extractedData);

    // Return the CSV file path or content
    return 'extracted-data.csv';
  }
}
