import { PartialType } from '@nestjs/swagger';

import { IsInt } from 'class-validator';
import { CreateExtractedDatumDto } from './create-extracted-datum.dto';

export class UpdateExtractedDatumDto extends PartialType(
  CreateExtractedDatumDto,
) {
  @IsInt()
  id: number;
}
