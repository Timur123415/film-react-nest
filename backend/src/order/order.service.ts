import { ConflictException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { ScreeningSession } from 'src/films/schema/films.schema';
import { FilmsDataProvider } from 'src/repository/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsDataProvider: FilmsDataProvider) {}

  async processOrderCreation(orderInfo: CreateOrderDto) {
    const { tickets } = orderInfo;

    if (!tickets || tickets.length === 0) {
      throw new ConflictException(
        'Билеты для оформления заказа не предоставлены',
      );
    }

    for (const ticket of tickets) {
      const { film, session, row, seat } = ticket;
      const movie = await this.filmsDataProvider.locateFilmById(film);

      if (!movie) {
        throw new ConflictException(
          `Фильм с идентификатором ${film} не найден`,
        );
      }

      const screening: ScreeningSession = movie.schedule.find(
        (screen) => screen.id === session,
      );

      if (!screening) {
        throw new ConflictException(
          `Сеанс с идентификатором ${session} отсутствует`,
        );
      }

      const seatLabel = `${row}:${seat}`;
      if (screening.taken.includes(seatLabel)) {
        throw new ConflictException('Данное место уже занято');
      }

      screening.taken.push(seatLabel);
      await movie.save();
    }

    return {
      total: tickets.length,
      items: tickets,
    };
  }
}
