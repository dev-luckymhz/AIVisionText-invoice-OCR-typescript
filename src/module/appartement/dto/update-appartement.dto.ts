import { PartialType } from '@nestjs/swagger';
import { CreateAppartementDto } from './create-appartement.dto';

export class UpdateAppartementDto extends PartialType(CreateAppartementDto) {}
