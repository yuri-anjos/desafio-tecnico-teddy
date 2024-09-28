import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto, SignupUserDto, TokenDto } from './auth.dto';
import { LocalAuthGuard } from './components/local-auth.guard';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'User successfully create',
    type: TokenDto,
  })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @ApiBody({ type: SignupUserDto })
  @Post('signup')
  signup(@Body() signupUserDto: SignupUserDto): Promise<TokenDto> {
    return this.authService.signup(signupUserDto);
  }

  @ApiResponse({
    status: 201,
    description: 'User successfully logged in',
    type: TokenDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: SigninUserDto })
  @Post('signin')
  @HttpCode(201)
  @UseGuards(LocalAuthGuard)
  signin(@Body() signinUserDto: SigninUserDto): Promise<TokenDto> {
    return this.authService.signin(signinUserDto);
  }
}
