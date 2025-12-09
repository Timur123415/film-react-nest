import { Inject, Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/film.dto';
import {
  FILMS_REPOSITORY_TOKEN,
  IFilmsRepository,
} from 'src/repository/interfaces/films-repository.interface';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY_TOKEN)
    private readonly repository: IFilmsRepository,
  ) {}

  public async findAll() {
    const films = await this.repository.findAll();
    return films;
  }

  public async findById(filmId: string) {
    const film = await this.repository.findById(filmId);
    return film;
  }

  public async create(payload: CreateFilmDto) {
    const newFilm = await this.repository.create(payload);
    return newFilm;
  }
}
