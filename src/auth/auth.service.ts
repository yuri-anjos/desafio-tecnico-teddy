import { Injectable } from '@nestjs/common';
import { SigninUserDto, SignupUserDto, TokenDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupUserDto: SignupUserDto): Promise<TokenDto> {
    const userAlreadyExists = await this.userService.findByEmail(
      signupUserDto.email,
    );
    if (userAlreadyExists) {
      throw new Error('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signupUserDto.password, salt);

    const newUser = await this.userService.create({
      ...signupUserDto,
      password: hashedPassword,
    } as User);

    const accessToken = this.jwtService.sign({
      id: newUser.id,
    });

    const userDto = plainToClass(UserDto, newUser);
    return { user: userDto, accessToken };
  }

  async signin(signinUserDto: SigninUserDto): Promise<TokenDto> {
    const user = await this.userService.findByEmail(signinUserDto.email);
    if (!user || !(await user.validatePassword(signinUserDto.password))) {
      throw new Error('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      id: user.id,
    });

    const userDto = plainToClass(UserDto, user);
    return { user: userDto, accessToken };
  }
}
