import { Test, TestingModule } from '@nestjs/testing';
import { CompactUrlController } from './compact-url.controller';

describe('CompactUrlController', () => {
  let controller: CompactUrlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompactUrlController],
    }).compile();

    controller = module.get<CompactUrlController>(CompactUrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
