import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DocumentModelService } from './document-model.service';
import { CreateDocumentModelDto } from './dto/create-document-model.dto';
import { UpdateDocumentModelDto } from './dto/update-document-model.dto';

@Controller('document-model')
export class DocumentModelController {
  constructor(private readonly documentModelService: DocumentModelService) {}

  @Post()
  create(@Body() createDocumentModelDto: CreateDocumentModelDto) {
    return this.documentModelService.create(createDocumentModelDto);
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
}
