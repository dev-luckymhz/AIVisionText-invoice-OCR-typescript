import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query, // Import Query decorator
} from '@nestjs/common';
import { AppartementService } from './appartement.service';
import { CreateApartmentDto } from './dto/create-appartement.dto';
import { UpdateApartmentDto } from './dto/update-appartement.dto';

@Controller('appartement')
export class AppartementController {
  constructor(private readonly appartementService: AppartementService) {}

  @Post()
  create(@Body() createAppartementDto: CreateApartmentDto) {
    return this.appartementService.create(createAppartementDto);
  }

  @Get()
  findAll(
    @Query('keyword') keyword: string, // Add keyword query parameter
    @Query('page') page: number = 1, // Add page query parameter with a default value of 1
    @Query('take') take: number = 10, // Add take query parameter with a default value of 10
  ) {
    return this.appartementService.findAll(keyword, page, take);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appartementService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppartementDto: UpdateApartmentDto,
  ) {
    return this.appartementService.update(+id, updateAppartementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appartementService.remove(+id);
  }
}
