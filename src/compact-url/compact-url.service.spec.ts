import { Test, TestingModule } from '@nestjs/testing';
import { CompactUrlService } from './compact-url.service';
import { CompactUrl } from './compact-url.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CompactUrlService', () => {
  let service: CompactUrlService;

  const mockCompactUrlRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompactUrlService,
        {
          provide: getRepositoryToken(CompactUrl),
          useValue: mockCompactUrlRepository,
        },
      ],
    }).compile();

    service = module.get<CompactUrlService>(CompactUrlService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
