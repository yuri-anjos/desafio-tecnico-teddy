import { Module } from '@nestjs/common';
import { CompactUrlService } from './compact-url.service';
import { CompactUrlController } from './compact-url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompactUrl } from './compact-url.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompactUrl])],
  providers: [CompactUrlService],
  controllers: [CompactUrlController],
})
export class CompactUrlModule {}
