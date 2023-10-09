// create.dto.ts
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateApartmentDto {
  @IsNotEmpty()
  @IsString()
  unitNumber: string;

  @IsNotEmpty()
  @IsInt()
  numberOfBedrooms: number;

  @IsNotEmpty()
  @IsInt()
  numberOfBathrooms: number;

  @IsNotEmpty()
  squareFootage: number;

  @IsNotEmpty()
  @IsInt()
  propertyId: number; // Assuming you want to associate the apartment with a property
}
