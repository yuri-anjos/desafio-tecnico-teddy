import { Test, TestingModule } from '@nestjs/testing';
import { CompactUrlController } from './compact-url.controller';
import { CompactUrlService } from './compact-url.service';
import { CompactUrl } from './compact-url.entity';
import { User } from '../user/user.entity';
import * as express from 'express';
import { SaveCompactUrlDto } from './compact-url.dto';

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

  describe('findAll', () => {
    it('should return an array of CompactUrl', async () => {
      const compactUrl = new CompactUrl();
      mockCompactUrlService.findAll.mockResolvedValue([compactUrl]);

      const result = await controller.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(CompactUrl);
    });
  });

  describe('findAllByUser', () => {
    it('should return an array of CompactUrl', async () => {
      const user = new User();
      const compactUrl = new CompactUrl();
      mockCompactUrlService.findAllByUser.mockResolvedValue([compactUrl]);

      const result = await controller.findAllByUser(user);
      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(CompactUrl);
    });
  });

  describe('findByUrlCode', () => {
    it('should return the original url', async () => {
      const urlCode = 'test';
      const originalUrl = 'http://www.example.com';
      mockCompactUrlService.findByUrlCode.mockResolvedValue({ originalUrl });
      const res = {
        redirect: jest.fn(),
      } as unknown as express.Response;
      await controller.findByUrlCode(urlCode, res);
      expect(res.redirect).toHaveBeenCalledWith(302, originalUrl);
    });
  });

  describe('insert', () => {
    it('should return the url of the new compacted url', async () => {
      const user = new User();
      const dto = new SaveCompactUrlDto();
      dto.originalUrl = 'http://www.example.com';
      mockCompactUrlService.insert.mockResolvedValue({ urlCode: 'test' });
      const result = await controller.insert(user, dto);
      expect(result).toBe(
        `http://localhost:${process.env.API_PORT}/compact-url/test`,
      );
    });
  });

  describe('update', () => {
    it('should return the url of the updated compacted url', async () => {
      const user = new User();
      const id = 1;
      const dto = new SaveCompactUrlDto();
      dto.originalUrl = 'http://www.example.com';
      mockCompactUrlService.update.mockResolvedValue({ urlCode: 'test' });
      const result = await controller.update(user, id, dto);
      expect(result).toBe(
        `http://localhost:${process.env.API_PORT}/compact-url/test`,
      );
    });
  });

  describe('delete', () => {
    it('should delete the compacted url', async () => {
      const user = new User();
      const id = 1;
      await controller.delete(user, id);
      expect(mockCompactUrlService.delete).toHaveBeenCalledWith(user, id);
    });
  });
});
