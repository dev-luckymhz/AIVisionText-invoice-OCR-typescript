import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
