import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  findAll() {
    return this.logementService.findAll();
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
