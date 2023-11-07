import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  createContract(@Body() createContractDto: CreateContractDto) {
    return this.contractService.createContract(createContractDto);
  }

  @Get()
  findAllContracts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('searchTerm') searchTerm: string,
  ) {
    return this.contractService.findAllContracts(page, limit, searchTerm);
  }

  @Get(':id')
  findOneContract(@Param('id') id: number) {
    return this.contractService.findOneContract(id);
  }

  @Put(':id')
  updateContract(
    @Param('id') id: number,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractService.updateContract(id, updateContractDto);
  }

  @Delete(':id')
  deleteContract(@Param('id') id: number) {
    return this.contractService.deleteContract(id);
  }
}
