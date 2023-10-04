import { Injectable } from '@nestjs/common';
import { CreateLogementDto } from './dto/create-logement.dto';
import { UpdateLogementDto } from './dto/update-logement.dto';

@Injectable()
export class LogementService {
  create(createLogementDto: CreateLogementDto) {
    return 'This action adds a new logement';
  }

  findAll() {
    return `This action returns all logement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logement`;
  }

  update(id: number, updateLogementDto: UpdateLogementDto) {
    return `This action updates a #${id} logement`;
  }

  remove(id: number) {
    return `This action removes a #${id} logement`;
  }
}
