import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
