import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  filmId: string;

  @IsString()
  @IsNotEmpty()
  session: string;

  @IsString()
  @IsNotEmpty()
  daytime: string;

  @IsInt()
  row: number;

  @IsInt()
  seat: number;

  @IsNumber()
  price: number;
}

export class OrderDto {
  @IsArray()
  @IsNotEmpty({ each: true })
  tickets: OrderItemDto[];

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;
}
