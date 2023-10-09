import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LogementService } from './logement.service';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';

@Controller('logement')
export class LogementController {
  constructor(private readonly logementService: LogementService) {}

  @Post()
  create(@Body() createLogementDto: CreateLogementDto) {
    return this.logementService.create(createLogementDto);
  }

  @Get()
  findAll(
    @Query('keyword') keyword: string, // Add keyword query parameter
    @Query('page') page: number = 1, // Add page query parameter with a default value of 1
    @Query('take') take: number = 10, // Add take query parameter with a default value of 10
  ) {
    return this.logementService.findAll(keyword, page, take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogementDto: UpdateLogementDto) {
    return this.logementService.update(+id, updateLogementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logementService.remove(+id);
  }
}
