import { OrderDto } from '../../orders/dto/order.dto';
import { OrderResultDto } from 'src/orders/dto/order-result.dto';

export interface IOrdersRepository {
  create(dto: OrderDto): Promise<{ items: OrderResultDto[]; total: number }>;
}

export const ORDERS_REPOSITORY_TOKEN = Symbol('IOrdersRepository');
