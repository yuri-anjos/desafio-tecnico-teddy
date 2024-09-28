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

export class TokenDto {
  constructor(partial: Partial<TokenDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  type: string = 'Bearer';
  @ApiProperty()
  user: UserDto;
}
