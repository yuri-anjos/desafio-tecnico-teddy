import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../user/user.entity';

export class SignupUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SigninUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class TokenDto {
  constructor(partial: Partial<TokenDto>) {
    Object.assign(this, partial);
  }

  readonly accessToken: string;
  readonly type: string = 'Bearer';
  readonly user: User;
}
