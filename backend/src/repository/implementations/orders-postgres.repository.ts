import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { IOrdersRepository } from '../interfaces/orders-repository.interface';
import { OrderDto, OrderItemDto } from 'src/orders/dto/order.dto';
import { OrderResultDto } from 'src/orders/dto/order-result.dto';
import { ScheduleEntity } from 'src/films/entities/schedule.entity';
import {
  FILMS_REPOSITORY_TOKEN,
  IFilmsRepository,
} from '../interfaces/films-repository.interface';

@Injectable()
export class PostgresOrdersRepository implements IOrdersRepository {
  constructor(
    @Inject(FILMS_REPOSITORY_TOKEN)
    private readonly filmsRepository: IFilmsRepository,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    dto: OrderDto,
  ): Promise<{ items: OrderResultDto[]; total: number }> {
    const createdItems: OrderResultDto[] = [];

    await this.dataSource.transaction(async (transactionManager) => {
      for (const ticket of dto.tickets) {
        const seatKey = this.composeSeatKey(ticket.row, ticket.seat);

        await this.ensureFilmExists(ticket.filmId);

        const session = await this.getSessionOrThrow(
          transactionManager,
          ticket.session,
          ticket.filmId,
        );

        this.ensureSeatIsFree(session, seatKey);

        session.taken = this.markSeatAsTaken(session.taken, seatKey);
        await transactionManager.save(session);

        createdItems.push(this.toOrderResult(ticket));
      }
    });

    return {
      items: createdItems,
      total: createdItems.length,
    };
  }

  private composeSeatKey(row: number, seat: number): string {
    return `${row}:${seat}`;
  }

  private async ensureFilmExists(filmId: string): Promise<void> {
    const film = await this.filmsRepository.findById(filmId);
    if (!film) {
      throw new NotFoundException(`Film with id ${filmId} not found`);
    }
  }

  private async getSessionOrThrow(
    manager: EntityManager,
    sessionId: string,
    filmId: string,
  ): Promise<ScheduleEntity> {
    const session = await manager.findOne(ScheduleEntity, {
      where: { id: sessionId, filmId },
    });

    if (!session) {
      throw new NotFoundException(
        `Session with id ${sessionId} not found for film ${filmId}`,
      );
    }

    return session;
  }

  private ensureSeatIsFree(session: ScheduleEntity, place: string): void {
    const takenSeats = this.parseTaken(session.taken);
    if (takenSeats.includes(place)) {
      throw new ConflictException(
        `Seat ${place} is already taken for session ${session.id}`,
      );
    }
  }

  private toOrderResult(ticket: OrderItemDto): OrderResultDto {
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

  private parseTaken(value: string): string[] {
    return value ? value.split(',') : [];
  }

  private markSeatAsTaken(value: string, place: string): string {
    const takenSeats = this.parseTaken(value);

    if (!takenSeats.includes(place)) {
      takenSeats.push(place);
    }

    return takenSeats.join(',');
  }
}
