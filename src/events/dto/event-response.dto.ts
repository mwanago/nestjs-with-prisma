import { Exclude, Expose, Transform } from 'class-transformer';
import { parse } from 'postgres-range';

export class EventResponseDto {
  name: string;

  @Exclude()
  dateRange: string;

  @Expose()
  @Transform(({ obj }) => {
    const parsedRange = parse(obj.dateRange);
    return parsedRange.lower;
  })
  startDate: string;

  @Expose()
  @Transform(({ obj }) => {
    const parsedRange = parse(obj.dateRange);
    return parsedRange.upper;
  })
  endDate: string;
}
