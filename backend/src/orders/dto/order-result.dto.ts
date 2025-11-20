import { IsString, IsNumber, IsInt } from 'class-validator';

export class OrderResultDto {
  @IsString()
  filmId: string;

  @IsString()
  session: string;

  @IsString()
  daytime: string;

  @IsInt()
  row: number;

  @IsInt()
  seat: number;

  @IsNumber()
  price: number;
}
