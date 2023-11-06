import { IsNotEmpty } from 'class-validator';

export class ProductDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  qty: number;
}
