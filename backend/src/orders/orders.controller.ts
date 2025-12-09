import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async orderTickets(@Body() order: OrderDto) {
    return await this.orderService.orderTickets(order);
  }
}
