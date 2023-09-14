import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateDocumentModelDto {
  @IsOptional()
  @IsString()
  fileName: string;

  @IsOptional()
  @IsString()
  fileType: string;

  @IsOptional()
  @IsString()
  documentUrl: string;

  @IsOptional()
  @IsInt()
  userId: number;
}
