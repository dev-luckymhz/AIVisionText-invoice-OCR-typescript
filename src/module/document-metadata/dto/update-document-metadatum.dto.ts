import { PartialType } from '@nestjs/swagger';
import { CreateDocumentMetadatumDto } from './create-document-metadatum.dto';

export class UpdateDocumentMetadatumDto extends PartialType(CreateDocumentMetadatumDto) {}
