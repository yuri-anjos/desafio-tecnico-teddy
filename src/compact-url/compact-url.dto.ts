import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveCompactUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
