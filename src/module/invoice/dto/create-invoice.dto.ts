import {
  IsNotEmpty,
  IsArray,
  IsEmail,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductDTO } from '../product/dto/create-product.dto';

export class InvoiceDTO {
  @IsNotEmpty()
  customerName: string;

  @IsNotEmpty()
  address: string;

  @IsEmail()
  email: string;

  @IsString()
  InvNo: string;

  @IsNotEmpty()
  contactNo: number;

  additionalDetails: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDTO)
  products: ProductDTO[];
}
