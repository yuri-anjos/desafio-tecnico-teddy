import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CompactUrlService } from './compact-url.service';
import { CompactUrl } from './compact-url.entity';
import { CompactUrlDto, SaveCompactUrlDto } from './compact-url.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { plainToClass } from 'class-transformer';
import { ApplyUser } from 'src/auth/apply-user.guard';

@Controller('compact-url')
export class CompactUrlController {
  constructor(private readonly compactUrlService: CompactUrlService) {}

  @Get()
  async findAll(): Promise<CompactUrlDto[]> {
    const result = await this.compactUrlService.findAll();
    return result.map((compactedUrl) =>
      plainToClass(CompactUrlDto, compactedUrl),
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(@GetUser() user: User): Promise<CompactUrlDto[]> {
    const result = await this.compactUrlService.findAllByUser(user);
    return result.map((compactedUrl) =>
      plainToClass(CompactUrlDto, compactedUrl),
    );
  }

  @Get(':urlCode')
  async findByUrlCode(@Param('urlCode') urlCode: string): Promise<string> {
    const result = await this.compactUrlService.findByUrlCode(urlCode);
    return result.originalUrl;
  }

  @Post()
  @HttpCode(201)
  @UseGuards(ApplyUser)
  async insert(
    @GetUser() user: User,
    @Body() dto: SaveCompactUrlDto,
  ): Promise<string> {
    const compactedUrl = new CompactUrl();
    compactedUrl.user = user;
    compactedUrl.originalUrl = dto.originalUrl;
    const result = await this.compactUrlService.insert(compactedUrl);
    return `http://localhost:${process.env.API_PORT}/compact-url/${result.urlCode}`;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() saveCompactUrlDto: SaveCompactUrlDto,
  ): Promise<string> {
    const compactedUrl = await this.compactUrlService.findById(id, user);
    compactedUrl.originalUrl = saveCompactUrlDto.originalUrl;
    const result = await this.compactUrlService.update(id, compactedUrl);
    return `http://localhost:${process.env.API_PORT}/compact-url/${result.urlCode}`;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(@GetUser() user: User, @Param('id') id: number): Promise<void> {
    const compactedUrl = await this.compactUrlService.findById(id, user);
    this.compactUrlService.delete(compactedUrl);
  }
}
