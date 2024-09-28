import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SigninUserDto, SignupUserDto, TokenDto, TokenType } from './auth.dto';
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
    return { user: new UserDto(user), accessToken, type: TokenType };
  }

  async signin(user: User): Promise<TokenDto> {
    const accessToken = this.jwtService.sign({
      id: user.id,
    });

    return { user: new UserDto(user), accessToken, type: TokenType };
  }
}
