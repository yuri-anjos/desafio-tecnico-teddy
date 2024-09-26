import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto, SignupUserDto, TokenDto } from './auth.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupUserDto: SignupUserDto): Promise<TokenDto> {
    return this.authService.signup(signupUserDto);
  }

  @Post('signin')
  @HttpCode(201)
  @UseGuards(LocalAuthGuard)
  signin(@Body() signinUserDto: SigninUserDto): Promise<TokenDto> {
    return this.authService.signin(signinUserDto);
  }
}
