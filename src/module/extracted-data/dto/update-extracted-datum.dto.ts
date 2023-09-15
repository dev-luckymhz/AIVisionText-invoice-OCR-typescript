import { PartialType } from '@nestjs/swagger';
import { CreateExtractedDatumDto } from './create-extracted-datum.dto';

export class UpdateExtractedDatumDto extends PartialType(
  CreateExtractedDatumDto,
) {}
