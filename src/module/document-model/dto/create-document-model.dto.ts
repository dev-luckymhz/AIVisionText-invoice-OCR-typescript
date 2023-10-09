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
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  fileContent: string;

  @IsNotEmpty()
  @IsInt()
  userId?: number;
}
