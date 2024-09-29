import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { SignupUserDto, TokenDto, TokenType } from './auth.dto';
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

  private readonly logger = new Logger(AuthService.name);

  async signup(dto: SignupUserDto): Promise<TokenDto> {
    this.logger.log('signup');
    const userAlreadyExists = await this.userService.findByEmail(dto.email);
    if (userAlreadyExists) {
      this.logger.error('Email already in use');
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
    this.logger.log('signin');
    const accessToken = this.jwtService.sign({
      id: user.id,
    });

    return { user: new UserDto(user), accessToken, type: TokenType };
  }
}
