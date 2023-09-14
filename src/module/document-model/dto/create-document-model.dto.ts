import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateDocumentModelDto {
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  fileType: string;

  @IsNotEmpty()
  @IsString()
  documentUrl: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
