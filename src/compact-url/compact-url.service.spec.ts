import { Test, TestingModule } from '@nestjs/testing';
import { CompactUrlService } from './compact-url.service';
import { CompactUrl } from './compact-url.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { SaveCompactUrlDto } from './compact-url.dto';

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

  describe('findById', () => {
    it('should return a CompactUrl if found', async () => {
      const mockCompactUrl = new CompactUrl();
      mockCompactUrlRepository.findOne.mockResolvedValue(mockCompactUrl);

      const result = await service.findById(1);

      expect(result).toEqual(mockCompactUrl);
    });

    it('should throw NotFoundException if not found', async () => {
      mockCompactUrlRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return a list of CompactUrl', async () => {
      const mockCompactUrls = [new CompactUrl()];
      mockCompactUrlRepository.find.mockResolvedValue(mockCompactUrls);

      const result = await service.findAll();

      expect(result).toEqual(mockCompactUrls);
    });
  });

  describe('findAllByUser', () => {
    it('should return a list of CompactUrl from the user', async () => {
      const mockCompactUrls = [new CompactUrl()];
      mockCompactUrlRepository.find.mockResolvedValue(mockCompactUrls);

      const result = await service.findAllByUser(new User());

      expect(result).toEqual(mockCompactUrls);
    });
  });

  describe('findByUrlCode', () => {
    it('should return a CompactUrl if found', async () => {
      const mockCompactUrl = new CompactUrl();
      mockCompactUrl.clickCount = 1;
      const compactUrlPostUpdate = new CompactUrl();
      compactUrlPostUpdate.clickCount = 2;
      mockCompactUrlRepository.findOne.mockResolvedValue(mockCompactUrl);
      mockCompactUrlRepository.save.mockResolvedValue(compactUrlPostUpdate);

      const result = await service.findByUrlCode('ABC123');

      expect(result).toEqual(compactUrlPostUpdate);
    });

    it('should throw NotFoundException if not found', async () => {
      mockCompactUrlRepository.findOne.mockResolvedValue(null);

      await expect(service.findByUrlCode('ABC123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('insert', () => {
    it('should insert a new CompactUrl', async () => {
      const mockCompactUrl = new CompactUrl();
      mockCompactUrl.originalUrl = 'https://example.com';
      mockCompactUrl.urlCode = 'ABC123';
      const mockUser = new User();
      const mockSaveCompactUrlDto = new SaveCompactUrlDto();
      mockSaveCompactUrlDto.originalUrl = 'https://example.com';

      mockCompactUrlRepository.save.mockResolvedValue(mockCompactUrl);
      const result = await service.insert(mockUser, mockSaveCompactUrlDto);

      expect(result.originalUrl).toEqual(mockSaveCompactUrlDto.originalUrl);
      expect(result.urlCode).toEqual('ABC123');
    });
  });

  describe('update', () => {
    it('should update a CompactUrl', async () => {
      const compactUrlPostUpdate = new CompactUrl();
      compactUrlPostUpdate.originalUrl = 'https://example.com';
      compactUrlPostUpdate.urlCode = 'ABC123';
      const mockCompactUrl = new CompactUrl();
      const mockUser = new User();
      const mockSaveCompactUrlDto = new SaveCompactUrlDto();
      mockSaveCompactUrlDto.originalUrl = 'https://example.com';

      mockCompactUrlRepository.findOne.mockResolvedValue(mockCompactUrl);
      mockCompactUrlRepository.save.mockResolvedValue(compactUrlPostUpdate);

      const result = await service.update(mockUser, 1, mockSaveCompactUrlDto);

      expect(result.originalUrl).toEqual(mockSaveCompactUrlDto.originalUrl);
    });

    it('should throw ForbiddenException if not authorized', async () => {
      const mockUser = new User();
      mockUser.id = 1;

      const mockCompactUrl = new CompactUrl();
      mockCompactUrl.user = new User();

      const mockSaveCompactUrlDto = new SaveCompactUrlDto();
      mockSaveCompactUrlDto.originalUrl = 'https://example.com';

      mockCompactUrlRepository.findOne.mockResolvedValue(mockCompactUrl);

      await expect(
        service.update(mockUser, 1, mockSaveCompactUrlDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete a CompactUrl', async () => {
      const mockCompactUrl = new CompactUrl();
      const mockUser = new User();

      mockCompactUrlRepository.findOne.mockResolvedValue(mockCompactUrl);

      await service.delete(mockUser, 1);

      expect(mockCompactUrlRepository.softRemove).toHaveBeenCalledWith(
        mockCompactUrl,
      );
    });

    it('should throw ForbiddenException if not authorized', async () => {
      const mockCompactUrl = new CompactUrl();
      const mockUser = new User();
      mockUser.id = 1;

      mockCompactUrlRepository.findOne.mockResolvedValue(mockCompactUrl);

      await expect(service.delete(mockUser, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
