import { Injectable } from '@nestjs/common';
import { CreateAppartementDto } from './dto/create-appartement.dto';
import { UpdateAppartementDto } from './dto/update-appartement.dto';

@Injectable()
export class AppartementService {
  create(createAppartementDto: CreateAppartementDto) {
    return 'This action adds a new appartement';
  }

  findAll() {
    return `This action returns all appartement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appartement`;
  }

  update(id: number, updateAppartementDto: UpdateAppartementDto) {
    return `This action updates a #${id} appartement`;
  }

  remove(id: number) {
    return `This action removes a #${id} appartement`;
  }
}
