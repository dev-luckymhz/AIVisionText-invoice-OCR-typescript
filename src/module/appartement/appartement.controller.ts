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
import { Apartment } from './entities/appartement.entity';

@Controller('appartement')
export class AppartementController {
  constructor(private readonly appartementService: AppartementService) {}

  @Post()
  create(@Body() createAppartementDto: CreateApartmentDto) {
    return this.appartementService.create(createAppartementDto);
  }

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('take') take: number = 10,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC', // Default to ascending order
  ): Promise<Apartment[]> {
    return this.appartementService.findAll(
      keyword,
      page,
      take,
      sortBy,
      sortOrder,
    );
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
