import { Injectable } from '@nestjs/common';
import { CreateDocumentModelDto } from './dto/create-document-model.dto';
import { UpdateDocumentModelDto } from './dto/update-document-model.dto';

@Injectable()
export class DocumentModelService {
  create(createDocumentModelDto: CreateDocumentModelDto) {
    return createDocumentModelDto;
  }

  findAll() {
    return `This action returns all documentModel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} documentModel`;
  }

  update(id: number, updateDocumentModelDto: UpdateDocumentModelDto) {
    return updateDocumentModelDto;
  }

  remove(id: number) {
    return `This action removes a #${id} documentModel`;
  }
}
