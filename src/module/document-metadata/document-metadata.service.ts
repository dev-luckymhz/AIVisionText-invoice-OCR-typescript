import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentMetadatumDto } from './dto/create-document-metadatum.dto';
import { UpdateDocumentMetadatumDto } from './dto/update-document-metadatum.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentMetadatum } from './entities/document-metadatum.entity';

@Injectable()
export class DocumentMetadataService {
  constructor(
    @InjectRepository(DocumentMetadatum)
    private readonly documentMetadatumRepository: Repository<DocumentMetadatum>,
  ) {}

  async create(createDocumentMetadatumDto: CreateDocumentMetadatumDto) {
    const documentMetadatum = this.documentMetadatumRepository.create(
      createDocumentMetadatumDto,
    );

    return await this.documentMetadatumRepository.save(documentMetadatum);
  }

  async findAll() {
    return await this.documentMetadatumRepository.find();
  }

  async findOne(id: number) {
    const documentMetadatum = await this.documentMetadatumRepository.findOne({
      where: { id },
    });
    if (!documentMetadatum) {
      throw new NotFoundException(`DocumentMetadatum with ID #${id} not found`);
    }
    return documentMetadatum;
  }

  async update(
    id: number,
    updateDocumentMetadatumDto: UpdateDocumentMetadatumDto,
  ) {
    await this.findOne(id); // Check if the documentMetadatum exists
    await this.documentMetadatumRepository.update(
      id,
      updateDocumentMetadatumDto,
    );
    return await this.findOne(id); // Return the updated documentMetadatum
  }

  async remove(id: number) {
    const documentMetadatum = await this.findOne(id); // Check if the documentMetadatum exists
    await this.documentMetadatumRepository.remove(documentMetadatum);
    return `DocumentMetadatum with ID #${id} has been removed`;
  }
}
