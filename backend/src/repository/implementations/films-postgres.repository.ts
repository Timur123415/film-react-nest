import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilmEntity } from '../../films/entities/film.entity';
import { ScheduleEntity } from 'src/films/entities/schedule.entity';
import { CreateFilmDto } from '../../films/dto/film.dto';
import { IFilmsRepository } from '../interfaces/films-repository.interface';

@Injectable()
export class PostgresFilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly repository: Repository<FilmEntity>,
  ) {}

  public async findAll(): Promise<FilmEntity[]> {
    const films = await this.repository.find({
      relations: { schedule: true },
    });
    return films;
  }

  public async findById(filmId: string): Promise<FilmEntity | null> {
    return this.repository.findOne({
      where: { id: filmId },
      relations: { schedule: true },
    });
  }

  public async create(payload: CreateFilmDto): Promise<FilmEntity> {
    return this.repository.manager.transaction(async (entityManager) => {
      const { schedule, ...filmData } = payload;
      const newFilm = entityManager.create(FilmEntity, filmData);

      const savedFilm = await entityManager.save(newFilm);
      if (schedule && schedule.length > 0) {
        const scheduleEntities = schedule.map((slot) => {
          return entityManager.create(ScheduleEntity, {
            ...slot,
            filmId: savedFilm.id,
            taken: '',
          });
        });

        await entityManager.save(scheduleEntities);
      }

      return savedFilm;
    });
  }
}
