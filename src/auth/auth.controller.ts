import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto, SignupUserDto, TokenDto } from './auth.dto';
import { LocalAuthGuard } from './components/local-auth.guard';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from './components/get-user.decorator';
import { User } from '../user/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);

  @ApiResponse({
    status: 200,
    description: 'User successfully create',
    type: TokenDto,
  })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @ApiBody({ type: SignupUserDto })
  @Post('signup')
  signup(@Body() signupUserDto: SignupUserDto): Promise<TokenDto> {
    this.logger.log('signup');
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
  signin(@GetUser() user: User): Promise<TokenDto> {
    this.logger.log('signin');
    return this.authService.signin(user);
  }
}
