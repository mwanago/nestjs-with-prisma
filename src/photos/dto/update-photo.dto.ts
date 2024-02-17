import { IsString, IsNotEmpty } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class UpdatePhotoDto {
  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  imageUrl?: string;
}
