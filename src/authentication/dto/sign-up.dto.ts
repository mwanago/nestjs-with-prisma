import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';
import { Type } from 'class-transformer';
import { AddressDto } from './address-dto';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @CanBeUndefined()
  @Type(() => AddressDto)
  @IsObject()
  @ValidateNested()
  address?: AddressDto;
}
