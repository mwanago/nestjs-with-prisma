import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ArticleSearchParamsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  textSearch: string | null;
}
