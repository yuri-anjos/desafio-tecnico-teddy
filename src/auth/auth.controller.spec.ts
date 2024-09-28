import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninUserDto, SignupUserDto } from './auth.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call signup service', async () => {
      const signupUserDto = new SignupUserDto();
      signupUserDto.name = 'name';
      signupUserDto.email = 'email';
      signupUserDto.password = 'password';

      await controller.signup(signupUserDto);

      expect(mockAuthService.signup).toHaveBeenCalledWith(signupUserDto);
      expect(mockAuthService.signup).toHaveBeenCalledTimes(1);
    });
  });

  describe('signin', () => {
    it('should call signin service', async () => {
      const signinUserDto = new SigninUserDto();
      signinUserDto.email = 'email';
      signinUserDto.password = 'password';

      await controller.signin(signinUserDto);

      expect(mockAuthService.signin).toHaveBeenCalledWith(signinUserDto);
      expect(mockAuthService.signin).toHaveBeenCalledTimes(1);
    });
  });
});
