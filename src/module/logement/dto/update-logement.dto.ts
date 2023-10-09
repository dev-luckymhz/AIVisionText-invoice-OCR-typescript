// update.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateLogementDto } from './create-logement.dto';

export class UpdateLogementDto extends PartialType(CreateLogementDto) {}
