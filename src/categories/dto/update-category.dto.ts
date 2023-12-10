import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  name?: string;

  @IsInt({ each: true })
  @CanBeUndefined()
  nestedCategoryIds?: number[];
}
