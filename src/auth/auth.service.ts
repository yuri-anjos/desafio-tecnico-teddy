import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninUserDto, SignupUserDto, TokenDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupUserDto): Promise<TokenDto> {
    const userAlreadyExists = await this.userService.findByEmail(dto.email);
    if (userAlreadyExists) {
      throw new ConflictException('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await this.userService.create({
      ...dto,
      password: hashedPassword,
    } as User);

    const accessToken = this.jwtService.sign({
      id: user.id,
    });
    return new TokenDto({ user: new UserDto(user), accessToken });
  }

  async signin(dto: SigninUserDto): Promise<TokenDto> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !(await user.validatePassword(dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      id: user.id,
    });

    return new TokenDto({ user: new UserDto(user), accessToken });
  }
}
