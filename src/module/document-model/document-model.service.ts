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
      document.documentUrlNextCloud = `/cil-file-nextcloud-folder/document/${file.filename}`;
      document.user = createDocumentModelDto.userId
        ? await User.findOne({
            where: { id: createDocumentModelDto.userId },
          })
        : null;
      document.uploadDate = new Date();
      document.name = createDocumentModelDto.name;
      document.description = createDocumentModelDto.description;
      /*      const fileContent = this.DataCleaningService.replaceLineBreaks(
        createDocumentModelDto.fileContent,
      );*/
      return await this.documentModelRepository.save(document);
    } catch (error) {
      throw new BadRequestException('Failed to upload the document : ' + error);
    }
  }

  async getFileContent(fileContent: string) {
    this.DataCleaningService.replaceLineBreaks(fileContent);
  }

  async findAll(
    keyword: string,
    page: number,
    take: number,
    sortBy: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC', // Default to ascending order
  ): Promise<{
    documents: DocumentModel[];
    currentPage: number;
    perPage: number;
    total: number;
  }> {
    const skip = (page - 1) * take;

    let query = this.documentModelRepository
      .createQueryBuilder('documentModel')
      .leftJoinAndSelect('documentModel.user', 'user')
      .leftJoinAndSelect('documentModel.category', 'category');

    // Handle sorting based on the 'sortBy' and 'sortOrder' parameters
    switch (sortBy) {
      case 'name':
        query = query.addOrderBy('documentModel.name', sortOrder);
        break;
      case 'fileName':
        query = query.addOrderBy('documentModel.fileName', sortOrder);
        break;
      case 'fileType':
        query = query.addOrderBy('documentModel.fileType', sortOrder);
        break;
      case 'documentUrl':
        query = query.addOrderBy('documentModel.documentUrl', sortOrder);
        break;
      default:
        // Sort by 'id' by default
        query = query.addOrderBy('documentModel.id', sortOrder);
    }

    if (keyword) {
      query = query
        .where('documentModel.fileName LIKE :keyword', {
          keyword: `%${keyword}%`,
        })
        .orWhere('documentModel.fileType LIKE :keyword', {
          keyword: `%${keyword}%`,
        })
        .orWhere('documentModel.name LIKE :keyword', {
          keyword: `%${keyword}%`,
        })
        .orWhere('documentModel.description LIKE :keyword', {
          keyword: `%${keyword}%`,
        });
    }

    const [documents, totalCount] = await query
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      documents,
      currentPage: page,
      perPage: take,
      total: totalCount,
    };
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

    const client = createNextClient();
    // Delete the file from the server
    fs.unlinkSync(document.documentUrl);

    const file = await client.getFile(document.documentUrlNextCloud);
    await file.delete();

    await this.documentModelRepository.remove(document);
  }

  /*  async getDocumentFile(id: number): Promise<fs.ReadStream> {
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
      const url = file.getUrl(); // Get the file content as a buffer
      const fileStream = fs.createReadStream(url);
      console.log(url);
      if (!fileStream) {
        throw new NotFoundException('File not found');
      }

      return fileStream;
    } catch (error) {
      // Handle any exceptions that may occur during the process
      console.error(error);
      throw new Error('An error occurred while fetching the document');
    }
  } */

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
