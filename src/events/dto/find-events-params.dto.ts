import { IsOptional, IsISO8601 } from 'class-validator';

export class FindEventsParamsDto {
  @IsOptional()
  @IsISO8601({
    strict: true,
  })
  date?: string;
}
