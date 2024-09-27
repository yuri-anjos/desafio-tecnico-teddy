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
import { SaveCompactUrlDto } from './compact-url.dto';
import { JwtAuthGuard } from '../auth/components/jwt-auth.guard';
import { User } from '../user/user.entity';
import { GetUser } from '../auth/components/get-user.decorator';
import { ApplyUser } from '../auth/components/apply-user.guard';

@Controller('compact-url')
export class CompactUrlController {
  constructor(private readonly compactUrlService: CompactUrlService) {}

  @Get()
  async findAll(): Promise<any[]> {
    const result = await this.compactUrlService.findAll();
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(@GetUser() user: User): Promise<any[]> {
    const result = await this.compactUrlService.findAllByUser(user);
    return result;
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
    const result = await this.compactUrlService.insert(user, dto);
    return `http://localhost:${process.env.API_PORT}/compact-url/${result.urlCode}`;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() dto: SaveCompactUrlDto,
  ): Promise<string> {
    const result = await this.compactUrlService.update(user, id, dto);
    return `http://localhost:${process.env.API_PORT}/compact-url/${result.urlCode}`;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(@GetUser() user: User, @Param('id') id: number): Promise<void> {
    this.compactUrlService.delete(user, id);
  }
}
