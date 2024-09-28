import { Test, TestingModule } from '@nestjs/testing';
import { CompactUrlController } from './compact-url.controller';
import { CompactUrlService } from './compact-url.service';

describe('CompactUrlController', () => {
  let controller: CompactUrlController;

  const mockCompactUrlService = {
    findAll: jest.fn(),
    findAllByUser: jest.fn(),
    findByUrlCode: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompactUrlController],
      providers: [
        { provide: CompactUrlService, useValue: mockCompactUrlService },
      ],
    }).compile();

    controller = module.get<CompactUrlController>(CompactUrlController);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
