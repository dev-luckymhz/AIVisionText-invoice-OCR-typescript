import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DocumentMetadataService } from './document-metadata.service';
import { CreateDocumentMetadatumDto } from './dto/create-document-metadatum.dto';
import { UpdateDocumentMetadatumDto } from './dto/update-document-metadatum.dto';

@Controller('document-metadata')
export class DocumentMetadataController {
  constructor(
    private readonly documentMetadataService: DocumentMetadataService,
  ) {}

  @Post()
  create(@Body() createDocumentMetadatumDto: CreateDocumentMetadatumDto) {
    return this.documentMetadataService.create(createDocumentMetadatumDto);
  }

  @Get()
  findAll() {
    return this.documentMetadataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentMetadataService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentMetadatumDto: UpdateDocumentMetadatumDto,
  ) {
    return this.documentMetadataService.update(+id, updateDocumentMetadatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentMetadataService.remove(+id);
  }
}
