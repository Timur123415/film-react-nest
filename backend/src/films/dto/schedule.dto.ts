import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class ScheduleItemDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  daytime: string;

  @IsNumber()
  hall: number;

  @IsNumber()
  rows: number;

  @IsNumber()
  seats: number;

  @IsNumber()
  price: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  taken?: string[];
}
