import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentModelService } from './document-model.service';
import { CreateDocumentModelDto } from './dto/create-document-model.dto';
import { UpdateDocumentModelDto } from './dto/update-document-model.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { AuthGuard } from '../users/guard/auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ocrSpace } from 'ocr-space-api-wrapper';

@Controller('documents')
export class DocumentModelController {
  constructor(private readonly documentModelService: DocumentModelService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/document',
        filename(req, file, callback) {
          // Split the string by the dot character and slice off the last part
          const parts = file.originalname.split('.');
          const fileNameWithoutExtension = parts.slice(0, -1).join('.');

          const randomName = Math.random().toString(10).substr(2, 12);
          return callback(
            null,
            `${fileNameWithoutExtension}-${randomName}${extname(
              file.originalname,
            )}`,
          );
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file,
    @Body() createDocumentModelDto: CreateDocumentModelDto,
    @Req() request: Request,
  ) {
    createDocumentModelDto.userId = request['user'].sub;
    try {
      const orcRequest = await ocrSpace(file.path, {
        apiKey: 'K85468754788957',
      });
      createDocumentModelDto.fileContent =
        orcRequest.ParsedResults[0]?.ParsedText;
      return await this.documentModelService.create(
        createDocumentModelDto,
        file,
      );
    } catch (error) {
      console.error(error);
      // Handle any exceptions that occur during the upload process.
      // You can return an error response or handle the error as needed.
      return 'An error occurred while uploading the file.';
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'id',
      sortOrder = 'ASC',
    } = query;
    return this.documentModelService.findAll(
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentModelService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Get(':id/extract')
  async extractOCRData(@Param('id') id: string): Promise<any> {
    try {
      const extractedData = await this.documentModelService.extractDataFromOCR(
        +id,
      );
      return { data: extractedData };
    } catch (error) {
      throw new HttpException(
        `Error extracting data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentModelDto: UpdateDocumentModelDto,
  ) {
    return this.documentModelService.update(+id, updateDocumentModelDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentModelService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Get('weekly')
  getWeeklyReport() {
    return this.documentModelService.getWeeklyReport();
  }

  @UseGuards(AuthGuard)
  @Get('monthly')
  getMonthlyReport() {
    return this.documentModelService.getMonthlyReport();
  }

  @UseGuards(AuthGuard)
  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    try {
      const fileStream = await this.documentModelService.getDocumentFile(+id);
      const contentType = this.documentModelService.getContentTypeFromExtension(
        fileStream.path.toString(),
      );
      res.setHeader('Content-Type', contentType);
      fileStream.pipe(res);
    } catch (error) {
      // Handle the error as needed, e.g., log it or return an error response.
      throw new NotFoundException(
        `Error while downloading file: ${error.message}`,
      );
    }
  }
}
