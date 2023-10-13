import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
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
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('take') take: number = 10,
    @Query('sortBy') sortBy: string = 'id', // Default to 'id'
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC', // Default to 'ASC'
  ) {
    return this.logementService.findAll(keyword, page, take, sortBy, sortOrder);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logementService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLogementDto: UpdateLogementDto,
  ) {
    return this.logementService.update(+id, updateLogementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logementService.remove(+id);
  }
}
