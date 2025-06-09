import { IsEmail ,IsNotEmpty, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6,6)
  otp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}