import { PartialType } from '@nestjs/swagger';
import { CreateDocumentModelDto } from './create-document-model.dto';

export class UpdateDocumentModelDto extends PartialType(
  CreateDocumentModelDto,
) {}
