import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ArticlesSearchParamsDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  textSearch: string | null;
}
