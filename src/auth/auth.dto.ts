import { IsEmail, IsString } from 'class-validator';
import { UserDto } from 'src/user/user.dto';

export class SignupUserDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class SigninUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}

export class TokenDto {
  accessToken: string;
  user: UserDto;
}
