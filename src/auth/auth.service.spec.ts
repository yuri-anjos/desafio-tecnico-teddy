import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { SigninUserDto, SignupUserDto, TokenType } from './auth.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../user/user.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findById: jest.fn(),
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: User, useValue: { validatePassword: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should throw ConflictException if email already exists', async () => {
      const dto = new SignupUserDto();
      dto.email = 'user@email.com';
      dto.name = 'user';
      dto.password = 'password';

      mockUserService.findByEmail.mockResolvedValue(new User());

      const result = service.signup(dto);
      await expect(result).rejects.toThrow(ConflictException);
      expect(mockUserService.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'user@email.com',
      );
    });

    it('should signup successfully', async () => {
      const dto = new SignupUserDto();
      dto.email = 'user@email.com';
      dto.name = 'user';
      dto.password = 'password';

      const accessToken = 'access_token';
      const user = new User();
      user.id = 1;

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.signup(dto);

      expect(result.user).toEqual(user);
      expect(result.accessToken).toEqual(accessToken);
      expect(mockUserService.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: dto.name, email: dto.email }),
      );
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
      expect(mockJwtService.sign).toHaveBeenCalledWith(user);
      expect(mockJwtService.sign).toHaveBeenCalledTimes(1);
    });
  });

  describe('signin', () => {
    it('should signin successfully', async () => {
      const user = new User();
      user.id = 1;
      user.validatePassword = jest.fn().mockResolvedValue(true);

      const expected = new UserDto(user);

      const accessToken = 'access_token';
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.signin(user);

      expect(result.user).toEqual(expected);
      expect(result.accessToken).toEqual(accessToken);
      expect(result.type).toEqual(TokenType);
    });
  });
});
