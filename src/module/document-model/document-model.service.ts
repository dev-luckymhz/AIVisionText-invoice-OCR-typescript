import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDocumentModelDto } from './dto/create-document-model.dto';
import { UpdateDocumentModelDto } from './dto/update-document-model.dto';
import { DocumentModel } from './entities/document-model.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { User } from '../users/entities/user.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DataCleaningService } from './data-cleaning.service';
import { OpenAI } from 'openai';
import { DocumentMetadatum } from '../document-metadata/entities/document-metadatum.entity';
import * as process from 'process';
import { DocumentCategory } from '../document-category/entities/document-category.entity';
import { Invoice } from '../invoice/entities/invoice.entity';
import { Contract } from '../contract/entities/contract.entity';
@Injectable()
export class DocumentModelService {
  constructor(
    @InjectRepository(DocumentModel)
    private readonly documentModelRepository: Repository<DocumentModel>,
    private readonly contractRepository: Repository<Contract>,
    private readonly invoiceRepository: Repository<Invoice>,
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
      document.fileContent = createDocumentModelDto.fileContent;
      document.user = createDocumentModelDto.userId
        ? await User.findOne({
            where: { id: createDocumentModelDto.userId },
          })
        : null;
      document.category = createDocumentModelDto.category
        ? await DocumentCategory.findOne({
            where: { id: createDocumentModelDto.category },
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
      relations: ['category'],
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
    } catch (error) {
      // Handle the error as needed, e.g., log it or return an error response.
      throw new Error(`Error while retrieving document file: ${error.message}`);
    }
  }

  async extractDataFromOCR(id: number): Promise<string> {
    const document = await this.documentModelRepository.findOne({
      where: { id },
    });
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `extract the important data from the ocr scanned file in a json format, give only the json? ${document.fileContent}`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const extractedData = JSON.parse(chatCompletion.choices[0].message.content);

    // Iterate over the extracted data and save it to DocumentMetadatum
    for (const key of Object.keys(extractedData)) {
      const value = extractedData[key];

      const metadata = new DocumentMetadatum();
      metadata.key = key;
      metadata.value = JSON.stringify(value);
      metadata.document = document;

      await metadata.save();
    }
    return extractedData;
  }

  async getWeeklyReport(id?: number): Promise<any> {
    let userInfo = null;
    if (id) {
      userInfo = await User.findOne({
        where: { id: id },
      });
    }
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const contracts = await this.contractRepository.count({
      where: { createdAt: MoreThan(oneWeekAgo) },
    });
    const documents = await this.documentModelRepository.count({
      where: { createdAt: MoreThan(oneWeekAgo) },
    });
    const invoices = await this.invoiceRepository.count({
      where: { createdAt: MoreThan(oneWeekAgo) },
    });

    return { userInfo, contracts, documents, invoices };
  }

  async getMonthlyReport(id?: number): Promise<any> {
    let userInfo = null;
    if (id) {
      userInfo = await User.findOne({
        where: { id: id },
      });
    }
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const contracts = await this.contractRepository.count({
      where: { createdAt: MoreThan(oneMonthAgo) },
    });
    const documents = await this.documentModelRepository.count({
      where: { createdAt: MoreThan(oneMonthAgo) },
    });
    const invoices = await this.invoiceRepository.count({
      where: { createdAt: MoreThan(oneMonthAgo) },
    });

    return { userInfo, contracts, documents, invoices };
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
