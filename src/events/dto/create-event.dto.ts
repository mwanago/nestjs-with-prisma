import { IsString, IsNotEmpty, IsISO8601 } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsISO8601({
    strict: true,
  })
  startDate: string;

  @IsISO8601({
    strict: true,
  })
  endDate: string;
}
