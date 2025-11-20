import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrdersRepository } from '../interfaces/orders-repository.interface';
import { OrderDto, OrderItemDto } from 'src/orders/dto/order.dto';
import { Film, FilmDocument } from 'src/films/film.schema';
import { OrderResultDto } from 'src/orders/dto/order-result.dto';
import { CreateFilmDto } from 'src/films/dto/film.dto';
import { ScheduleItemDto } from 'src/films/dto/schedule.dto';

type NormalizedTicket = OrderItemDto & { film: string; filmId?: string };

@Injectable()
export class MongoOrdersRepository implements IOrdersRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<FilmDocument>,
  ) {}

  async create(
    dto: OrderDto,
  ): Promise<{ items: OrderResultDto[]; total: number }> {
    const preparedTickets = this.prepareTickets(
      dto.tickets as NormalizedTicket[],
    );
    const responseItems: OrderResultDto[] = [];

    for (const ticket of preparedTickets) {
      const seatKey = this.composeSeatKey(ticket.row, ticket.seat);

      const filmDoc = await this.getFilmOrThrow(ticket.filmId!);
      const session = this.getSessionOrThrow(filmDoc, ticket.session);

      this.assertSeatIsFree(session, seatKey);

      session.taken.push(seatKey);
      await filmDoc.save();

      responseItems.push(this.mapToOrderResult(ticket));
    }

    return {
      items: responseItems,
      total: responseItems.length,
    };
  }

  private prepareTickets(
    tickets: NormalizedTicket[],
  ): (OrderItemDto & { filmId: string })[] {
    return tickets.map((ticket) => ({
      ...ticket,
      filmId: ticket.film,
    }));
  }

  private composeSeatKey(row: number, seat: number): string {
    return `${row}:${seat}`;
  }

  private async getFilmOrThrow(filmId: string) {
    const film = await this.filmModel.findOne({ id: filmId });
    if (!film) {
      throw new NotFoundException(`Film with id ${filmId} not found`);
    }
    return film;
  }

  private getSessionOrThrow(film: CreateFilmDto, sessionId: string) {
    const session = film.schedule.find((item) => item.id === sessionId);
    if (!session) {
      throw new NotFoundException(`Session with id ${sessionId} not found`);
    }
    return session;
  }

  private assertSeatIsFree(session: ScheduleItemDto, place: string) {
    if (session.taken.includes(place)) {
      throw new ConflictException(`Seat ${place} is already taken`);
    }
  }

  private mapToOrderResult(
    ticket: OrderItemDto & { filmId: string },
  ): OrderResultDto {
    const { filmId, session, daytime, row, seat, price } = ticket;

    return {
      filmId,
      session,
      daytime,
      row,
      seat,
      price,
    };
  }
}
