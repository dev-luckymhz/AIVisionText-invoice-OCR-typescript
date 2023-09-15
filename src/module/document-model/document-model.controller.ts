import {
  Body,
  Controller,
  Delete,
  Get,
  NestInterceptor,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentModelService } from './document-model.service';
import { CreateDocumentModelDto } from './dto/create-document-model.dto';
import { UpdateDocumentModelDto } from './dto/update-document-model.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('document-model')
export class DocumentModelController {
  constructor(private readonly documentModelService: DocumentModelService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file') as NestInterceptor)
  async uploadFile(
    @UploadedFile() file,
    @Body() createDocumentModelDto: CreateDocumentModelDto,
  ) {
    return await this.documentModelService.create(createDocumentModelDto, file);
  }

  @Get()
  findAll() {
    return this.documentModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentModelService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentModelDto: UpdateDocumentModelDto,
  ) {
    return this.documentModelService.update(+id, updateDocumentModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentModelService.remove(+id);
  }

  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const fileStream = await this.documentModelService.getDocumentFile(+id);

    res.setHeader('Content-Type', 'application/pdf'); // Adjust the content type as needed
    fileStream.pipe(res);
  }
}
