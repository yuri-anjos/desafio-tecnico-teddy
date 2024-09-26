import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompactUrl } from './compact-url.entity';
import { User } from 'src/user/user.entity';
import { createHash } from 'crypto';

@Injectable()
export class CompactUrlService {
  constructor(
    @InjectRepository(CompactUrl)
    private readonly compactUrlRepository: Repository<CompactUrl>,
  ) {}

  async findById(id: number, user: User): Promise<CompactUrl> {
    const found = await this.compactUrlRepository.findOne({
      where: { id, user },
    });

    if (!found) {
      throw new Error('Compact url not found');
    }
    return found;
  }

  findAll() {
    return this.compactUrlRepository.find();
  }

  findAllByUser(user: User): Promise<CompactUrl[]> {
    return this.compactUrlRepository.find({
      where: {
        user,
      },
    });
  }

  async findByUrlCode(urlCode: string): Promise<CompactUrl> {
    const compactedUrl = await this.compactUrlRepository.findOne({
      where: { urlCode },
    });
    compactedUrl.clickCount++;
    return this.compactUrlRepository.save(compactedUrl);
  }

  async insert(compactUrl: CompactUrl): Promise<CompactUrl> {
    compactUrl.id = undefined;
    compactUrl.urlCode = this.generateUrlCode(compactUrl.originalUrl);
    return this.compactUrlRepository.save(compactUrl);
  }

  async update(id: number, compactedUrl: CompactUrl): Promise<CompactUrl> {
    compactedUrl.urlCode = this.generateUrlCode(compactedUrl.originalUrl);
    this.compactUrlRepository.update(id, compactedUrl);
    return this.compactUrlRepository.findOne({ where: { id } });
  }
  delete(compactUrl: CompactUrl): void {
    this.compactUrlRepository.softRemove(compactUrl);
  }

  generateUrlCode(originalUrl: string): string {
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
