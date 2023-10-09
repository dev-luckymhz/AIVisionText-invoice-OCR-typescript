// create.dto.ts
import { IsNotEmpty, IsInt, IsString, IsOptional } from 'class-validator';

export class CreateLogementDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsInt()
  numberOfUnits: number;

  @IsNotEmpty()
  @IsString()
  owner: string;

  @IsOptional()
  @IsString()
  amenities: string;

  @IsOptional()
  @IsString()
  maintenanceContact: string;
}
