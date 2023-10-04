import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppartementService } from './appartement.service';
import { CreateAppartementDto } from './dto/create-appartement.dto';
import { UpdateAppartementDto } from './dto/update-appartement.dto';

@Controller('appartement')
export class AppartementController {
  constructor(private readonly appartementService: AppartementService) {}

  @Post()
  create(@Body() createAppartementDto: CreateAppartementDto) {
    return this.appartementService.create(createAppartementDto);
  }

  @Get()
  findAll() {
    return this.appartementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appartementService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppartementDto: UpdateAppartementDto) {
    return this.appartementService.update(+id, updateAppartementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appartementService.remove(+id);
  }
}
