// update.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateApartmentDto } from './create-appartement.dto';

export class UpdateApartmentDto extends PartialType(CreateApartmentDto) {}
