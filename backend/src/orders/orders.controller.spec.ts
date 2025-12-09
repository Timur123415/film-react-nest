import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './orders.controller';
import { OrderService } from './orders.service';
import { OrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    orderTickets: jest.fn((dto) => {
      return Promise.resolve({
        items: dto.tickets,
        total: dto.tickets.length,
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  it('должен вызывать сервис при создании заказа', async () => {
    const orderDto: OrderDto = {
      email: 'customer@example.com',
      phone: '+79990000000',
      tickets: [
        {
          filmId: 'film-1',
          session: 'session-1',
          daytime: '20:00',
          row: 5,
          seat: 10,
          price: 500,
        },
      ],
    };

    const result = await controller.orderTickets(orderDto);

    expect(service.orderTickets).toHaveBeenCalledWith(orderDto);
    
    expect(result).toEqual({
      items: orderDto.tickets,
      total: 1,
    });
  });
});