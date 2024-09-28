import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockUserService = {
    findById: jest.fn(),
  };

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user if the payload is valid', async () => {
      const user = new User();
      user.id = 1;

      mockUserService.findById.mockResolvedValue(user);
      const result = await strategy.validate({ id: 1 });

      expect(result).toEqual(user);
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
    });

    it('should return null if the user is not found', async () => {
      mockUserService.findById.mockResolvedValue(null);
      const result = await strategy.validate({ id: 1 });

      expect(result).toBeNull();
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
    });
  });
});
