import { IsNotEmpty, IsInt, IsString, IsDate, IsNumber } from 'class-validator';

export class CreateExtractedDatumDto {
  @IsInt()
  @IsNotEmpty()
  documentId: number;

  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
}
