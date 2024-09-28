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
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompactUrl } from './compact-url.entity';

@ApiBearerAuth()
@ApiTags('compact-url')
@Controller('compact-url')
export class CompactUrlController {
  constructor(private readonly compactUrlService: CompactUrlService) {}

  @ApiResponse({
    status: 200,
    description: 'All compacted urls',
    type: CompactUrl,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<CompactUrl[]> {
    const result = await this.compactUrlService.findAll();
    return result;
  }

  @ApiResponse({
    status: 200,
    description: 'All compacted urls of authenticated user',
    type: CompactUrl,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findAllByUser(@GetUser() user: User): Promise<CompactUrl[]> {
    const result = await this.compactUrlService.findAllByUser(user);
    return result;
  }

  @ApiResponse({
    status: 200,
    description: 'Get original url by urlCode',
    type: String,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiParam({ name: 'urlCode', type: String, required: true })
  @Get(':urlCode')
  async findByUrlCode(@Param('urlCode') urlCode: string): Promise<string> {
    const result = await this.compactUrlService.findByUrlCode(urlCode);
    return result.originalUrl;
  }

  @ApiResponse({
    status: 201,
    description: 'Creates a new compacted url',
    type: String,
  })
  @ApiBody({ type: SaveCompactUrlDto })
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

  @ApiResponse({
    status: 200,
    description: 'Updates a compacted url',
    type: String,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiParam({ name: 'id', type: Number, required: true })
  @ApiBody({ type: SaveCompactUrlDto })
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

  @ApiResponse({
    status: 204,
    description: 'Deletes a compacted url',
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 403, description: 'Not authorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiParam({ name: 'id', type: Number, required: true })
  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(@GetUser() user: User, @Param('id') id: number): Promise<void> {
    this.compactUrlService.delete(user, id);
  }
}
