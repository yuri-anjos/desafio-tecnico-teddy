import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompactUrl } from './compact-url.entity';
import { User } from '../user/user.entity';
import { createHash } from 'crypto';
import { SaveCompactUrlDto } from './compact-url.dto';

@Injectable()
export class CompactUrlService {
  constructor(
    @InjectRepository(CompactUrl)
    private readonly compactUrlRepository: Repository<CompactUrl>,
  ) {}

  private readonly logger = new Logger(CompactUrlService.name);

  async findById(id: number): Promise<CompactUrl> {
    this.logger.log('findById');
    const found = await this.compactUrlRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!found) {
      this.logger.error('Compact URL not found');
      throw new NotFoundException('Compact URL not found');
    }

    return found;
  }

  findAll() {
    this.logger.log('findAll');
    return this.compactUrlRepository.find();
  }

  findAllByUser(user: User): Promise<CompactUrl[]> {
    this.logger.log('findAllByUser');
    return this.compactUrlRepository.find({
      where: {
        user,
      },
    });
  }

  async findByUrlCode(urlCode: string): Promise<CompactUrl> {
    this.logger.log('findByUrlCode');
    const compactUrl = await this.compactUrlRepository.findOne({
      where: { urlCode },
    });

    if (!compactUrl) {
      this.logger.error('Url not found');
      throw new NotFoundException('Url not found');
    }

    compactUrl.clickCount++;
    return this.compactUrlRepository.save(compactUrl);
  }

  async insert(user: User, dto: SaveCompactUrlDto): Promise<CompactUrl> {
    this.logger.log('insert');
    const compactUrl = new CompactUrl();
    compactUrl.user = user;
    compactUrl.originalUrl = dto.originalUrl;
    compactUrl.urlCode = this.generateUrlCode(dto.originalUrl);

    return this.compactUrlRepository.save(compactUrl);
  }

  async update(
    user: User,
    id: number,
    dto: SaveCompactUrlDto,
  ): Promise<CompactUrl> {
    this.logger.log('update');
    const compactUrl = await this.findById(id);
    if (compactUrl.user?.id !== user.id) {
      this.logger.error('Unauthorized');
      throw new ForbiddenException('Unauthorized');
    }

    compactUrl.originalUrl = dto.originalUrl;
    compactUrl.urlCode = this.generateUrlCode(dto.originalUrl);

    return this.compactUrlRepository.save(compactUrl);
  }

  async delete(user: User, id: number): Promise<void> {
    this.logger.log('delete');
    const compactUrl = await this.findById(id);
    if (compactUrl.user?.id !== user.id) {
      this.logger.error('Unauthorized');
      throw new ForbiddenException('Unauthorized');
    }

    this.compactUrlRepository.softRemove(compactUrl);
  }

  generateUrlCode(originalUrl: string): string {
    this.logger.log('generateUrlCode');

    // Gera um hash SHA-256 da URL original
    const hash = createHash('sha256').update(originalUrl).digest('hex');

    // Converte o hash em um número (base 16)
    let hashNum = BigInt('0x' + hash);

    // Conjunto de caracteres para a URL encurtada
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortUrl = '';

    // Converte o número hash em uma string usando o conjunto de caracteres
    while (shortUrl.length < 6) {
      shortUrl += chars[Number(hashNum % BigInt(chars.length))];
      hashNum /= BigInt(chars.length);
    }

    return shortUrl;
  }
}
