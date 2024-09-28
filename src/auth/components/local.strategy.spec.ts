import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';
import { LocalStrategy } from './local.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;

  const mockUserService = { findByEmail: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user if the credentials are valid', async () => {
      const user = new User();
      user.id = 1;
      user.validatePassword = jest.fn().mockResolvedValue(true);

      mockUserService.findByEmail.mockResolvedValue(user);
      const result = await strategy.validate('email', 'password');

      expect(result).toEqual(user);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith('email');
      expect(user.validatePassword).toHaveBeenCalledWith('password');
    });

    it('should throw an UnauthorizedException if the user is not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(strategy.validate('email', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.findByEmail).toHaveBeenCalledWith('email');
    });

    it('should throw an UnauthorizedException if the password is invalid', async () => {
      const user = new User();
      user.id = 1;
      user.validatePassword = jest.fn().mockResolvedValue(false);

      mockUserService.findByEmail.mockResolvedValue(user);

      await expect(strategy.validate('email', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.findByEmail).toHaveBeenCalledWith('email');
      expect(user.validatePassword).toHaveBeenCalledWith('password');
    });
  });
});
