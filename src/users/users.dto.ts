import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class UserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  createdAt?: string;

  @IsString()
  updatedAt?: string;
}
