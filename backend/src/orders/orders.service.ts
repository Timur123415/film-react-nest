import { Inject, Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { OrderResultDto } from './dto/order-result.dto';
import {
  IOrdersRepository,
  ORDERS_REPOSITORY_TOKEN,
} from '../repository/interfaces/orders-repository.interface';

export interface OrderResponse {
  items: OrderResultDto[];
  total: number;
}

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDERS_REPOSITORY_TOKEN)
    private readonly repository: IOrdersRepository,
  ) {}

  async orderTickets(orderPayload: OrderDto): Promise<OrderResponse> {
    const createdOrder = await this.repository.create(orderPayload);

    return createdOrder;
  }
}
