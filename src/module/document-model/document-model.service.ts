import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDocumentModelDto } from './dto/create-document-model.dto';
import { UpdateDocumentModelDto } from './dto/update-document-model.dto';
import { DocumentModel } from './entities/document-model.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentModelService {
  constructor(
    @InjectRepository(DocumentModel)
    private readonly documentModelRepository: Repository<DocumentModel>,
  ) {}

  async create(
    createDocumentModelDto: CreateDocumentModelDto,
    file: any,
  ): Promise<DocumentModel> {
    try {
      const { originalname, buffer } = file;

      const document = new DocumentModel();
      document.fileName = originalname;
      document.fileType = createDocumentModelDto.fileType;
      document.documentUrl = path.join(__dirname, 'uploads', originalname);

      // Save the file to the server
      fs.writeFileSync(document.documentUrl, buffer);

      return await this.documentModelRepository.save(document);
    } catch (error) {
      throw new BadRequestException('Failed to upload the document');
    }
  }

  async findAll(): Promise<DocumentModel[]> {
    return await this.documentModelRepository.find();
  }

  async findOne(id: number): Promise<DocumentModel> {
    const document = await this.documentModelRepository.findOne({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async update(
    id: number,
    updateDocumentModelDto: UpdateDocumentModelDto,
  ): Promise<DocumentModel> {
    const document = await this.documentModelRepository.findOne({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Update document properties as needed
    document.fileType = updateDocumentModelDto.fileType;

    return await this.documentModelRepository.save(document);
  }

  async remove(id: number): Promise<void> {
    const document = await this.documentModelRepository.findOne({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // Delete the file from the server
    fs.unlinkSync(document.documentUrl);

    await this.documentModelRepository.remove(document);
  }

  async getDocumentFile(id: number): Promise<fs.ReadStream> {
    const document = await this.documentModelRepository.findOne({
      where: { id },
    });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const fileStream = fs.createReadStream(document.documentUrl);
    if (!fileStream) {
      throw new NotFoundException('File not found');
    }

    return fileStream;
  }
}
