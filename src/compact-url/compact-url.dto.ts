import { IsUrl } from 'class-validator';

export class SaveCompactUrlDto {
  @IsUrl()
  originalUrl: string;
}

export class CompactUrlDto {
  originalUrl: string;
  compactedUrl: string;
  urlCode: string;
  clickCount: number;
}
