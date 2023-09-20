import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

@Controller('document-model')
export class DocumentModelController {
  constructor(private readonly documentModelService: DocumentModelService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
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
    const contentType = this.documentModelService.getContentTypeFromExtension(
      fileStream.path.toString(),
    );
    console.log(contentType);
    res.setHeader('Content-Type', contentType); // Adjust the content type as needed
    fileStream.pipe(res);
  }
}
