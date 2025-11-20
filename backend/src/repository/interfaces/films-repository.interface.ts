import { FilmEntity } from 'src/films/entities/film.entity';
import { CreateFilmDto } from '../../films/dto/film.dto';
import { Film } from 'src/films/film.schema';

export interface IFilmsRepository {
  findAll(): Promise<Film[] | FilmEntity[]>;
  findById(id: string): Promise<Film | FilmEntity | null>;
  create(film: CreateFilmDto): Promise<Film | FilmEntity>;
}

export const FILMS_REPOSITORY_TOKEN = Symbol('IFilmsRepository');
