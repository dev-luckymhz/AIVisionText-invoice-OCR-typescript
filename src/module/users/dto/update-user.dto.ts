import { IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() // Fields are optional for updates
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8) // Adjust the minimum password length as needed
  password?: string;
}
