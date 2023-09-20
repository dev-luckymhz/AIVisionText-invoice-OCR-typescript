import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ExtractedDataService } from './extracted-data.service';
import { CreateExtractedDatumDto } from './dto/create-extracted-datum.dto';
import { UpdateExtractedDatumDto } from './dto/update-extracted-datum.dto';
import { Response } from 'express';
@Controller('extracted-data')
export class ExtractedDataController {
  constructor(private readonly extractedDataService: ExtractedDataService) {}

  @Post()
  async create(@Body() createExtractedDatumDto: CreateExtractedDatumDto) {
    // Call the validateAndCleanseData method to validate and cleanse the data
    const validatedData =
      await this.extractedDataService.validateAndCleanseData(
        createExtractedDatumDto,
      );

    // Now you can save the validated and cleansed data to the database
    return await this.extractedDataService.create(validatedData); // Return the created data
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

  @Get('export/excel')
  async exportToExcel(@Res() res: Response) {
    const excelBuffer = await this.extractedDataService.exportDataToExcel();

    // Set response headers for Excel download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=extracted-data.xlsx',
    );

    // Send the Excel binary data as the response
    res.send(excelBuffer);
  }
  @Get('transform/csv')
  async transformToCsv() {
    const csvFilePath = await this.extractedDataService.transformDataToCsv();
    return { csvFilePath };
  }
}
