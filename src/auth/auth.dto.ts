import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from '../user/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignupUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SigninUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export const TokenType = 'Bearer';
export class TokenDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  user: UserDto;
}
