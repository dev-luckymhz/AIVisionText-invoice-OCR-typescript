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
import { User } from '../users/entities/user.entity';

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
      const document = new DocumentModel();
      document.fileName = file.filename;
      document.fileType = file.mimetype;
      document.documentUrl = file.path;
      document.user = createDocumentModelDto.userId
        ? await User.findOne({
            where: { id: createDocumentModelDto.userId },
          })
        : null;
      document.uploadDate = new Date();
      console.log(document);
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

  getContentTypeFromExtension(filePath: string): string {
    // Use the 'path' module to extract the file extension
    const fileExtension = path.extname(filePath).toLowerCase();

    // Map file extensions to content types (customize as needed)
    const contentTypeMap: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.txt': 'text/plain',
      '.docx':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.pptx':
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };

    // Lookup the content type based on the file extension or default to 'application/octet-stream'
    return contentTypeMap[fileExtension] || 'application/octet-stream';
  }
}
