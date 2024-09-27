import { IsNotEmpty, IsUrl } from 'class-validator';

export class SaveCompactUrlDto {
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;
}
