import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExtractedDataService } from './extracted-data.service';
import { CreateExtractedDatumDto } from './dto/create-extracted-datum.dto';
import { UpdateExtractedDatumDto } from './dto/update-extracted-datum.dto';

@Controller('extracted-data')
export class ExtractedDataController {
  constructor(private readonly extractedDataService: ExtractedDataService) {}

  @Post()
  create(@Body() createExtractedDatumDto: CreateExtractedDatumDto) {
    return this.extractedDataService.create(createExtractedDatumDto);
  }

  @Get()
  findAll() {
    return this.extractedDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.extractedDataService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExtractedDatumDto: UpdateExtractedDatumDto,
  ) {
    return this.extractedDataService.update(+id, updateExtractedDatumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.extractedDataService.remove(+id);
  }
}
