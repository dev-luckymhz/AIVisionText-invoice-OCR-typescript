import { Injectable } from '@nestjs/common';
import { CreateExtractedDatumDto } from './dto/create-extracted-datum.dto';
import { UpdateExtractedDatumDto } from './dto/update-extracted-datum.dto';

@Injectable()
export class ExtractedDataService {
  create(createExtractedDatumDto: CreateExtractedDatumDto) {
    return createExtractedDatumDto;
  }

  findAll() {
    return `This action returns all extractedData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} extractedDatum`;
  }

  update(id: number, updateExtractedDatumDto: UpdateExtractedDatumDto) {
    return updateExtractedDatumDto;
  }

  remove(id: number) {
    return `This action removes a #${id} extractedDatum`;
  }
}
