import { Test, TestingModule } from '@nestjs/testing';
import { CompactUrlService } from './compact-url.service';

describe('CompactUrlService', () => {
  let service: CompactUrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompactUrlService],
    }).compile();

    service = module.get<CompactUrlService>(CompactUrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
