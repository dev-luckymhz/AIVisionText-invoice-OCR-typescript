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
import { Readable } from 'stream';
import { User } from '../users/entities/user.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DataCleaningService } from './data-cleaning.service';
import { createNextClient } from '../next-cloud/next-cloud.service';

@Injectable()
export class DocumentModelService {
  constructor(
    @InjectRepository(DocumentModel)
    private readonly documentModelRepository: Repository<DocumentModel>,
    private readonly DataCleaningService: DataCleaningService,
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
      document.name = createDocumentModelDto.name;
      document.description = createDocumentModelDto.description;
      // document.fileContent =
      //   this.DataCleaningService.replaceLineBreaksAndWhitespace(
      //     createDocumentModelDto.fileContent,
      //   );
      return await this.documentModelRepository.save(document);
    } catch (error) {
      throw new BadRequestException('Failed to upload the document : ' + error);
    }
  }

  async getFileContent(fileContent: string) {
    this.DataCleaningService.replaceLineBreaksAndWhitespace(fileContent);
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
    try {
      const client = createNextClient();
      const document = await this.documentModelRepository.findOne({
        where: { id },
      });
      if (!document) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }

      const file = await client.getFile(document.documentUrl);

      if (!file) {
        throw new NotFoundException('File not found');
      }

      const buffer = await file.getContent(); // Get the file content as a buffer
      const fileStream = new Readable();
      fileStream.push(buffer);
      fileStream.push(null); // Mark the end of the stream

      return fileStream;
    } catch (error) {
      // Handle any exceptions that may occur during the process
      console.error(error);
      throw new Error('An error occurred while fetching the document');
    }
  }

  getContentTypeFromExtension(filePath: string): string {
    // Use the 'path' module to extract the file extension
    const fileExtension = path.extname(filePath).toLowerCase();

    // Map file extensions to content types
    const contentTypeMap: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
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
