import {
  IsArray,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsFQDN,
} from 'class-validator';
import { ScheduleItemDto } from './schedule.dto';

export class CreateFilmDto {
  @IsString()
  title: string;

  @IsString()
  director: string;

  @IsString()
  about: string;

  @IsString()
  description: string;

  @IsNumber()
  rating: number;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsFQDN({}, { message: 'image must be correct URL' })
  image: string;

  @IsFQDN({}, { message: 'cover must be correct URL' })
  cover: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  schedule: ScheduleItemDto[];
}
