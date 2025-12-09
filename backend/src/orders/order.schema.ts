import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ required: true })
  film: string;

  @Prop({ required: true })
  session: string;

  @Prop({ type: [String], required: true })
  seats: string[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
