import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetFilmDto } from 'src/films/schedule/schedule';
import { Movie } from 'src/films/schema/films.schema';
import { GetScheduleDto } from 'src/films/dto/films.dto';

@Injectable()
export class FilmsDataProvider {
  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<Movie>,
  ) {}

  private convertToFilmDto(): (movie: Movie) => GetFilmDto {
    return (movieData) => {
      return {
        id: movieData.id,
        rating: movieData.rating,
        director: movieData.director,
        tags: movieData.tags,
        image: movieData.image,
        cover: movieData.cover,
        title: movieData.title,
        about: movieData.about,
        description: movieData.description,
        schedule: movieData.schedule,
      };
    };
  }

  async obtainAllFilms(): Promise<{ total: number; items: GetFilmDto[] }> {
    const movies = await this.movieModel.find().exec();
    const totalMovies = await this.movieModel.countDocuments().exec();

    return {
      total: totalMovies,
      items: movies.map(this.convertToFilmDto()),
    };
  }

  async obtainFilmSchedule(
    movieId: string,
  ): Promise<{ total: number; items: GetScheduleDto[] | null }> {
    const movieData = await this.movieModel.findOne({ id: movieId }).exec();

    if (!movieData) {
      throw new NotFoundException(
        `Фильм с идентификатором ${movieId} не найден в системе`,
      );
    }

    return {
      total: movieData.schedule.length,
      items: movieData.schedule,
    };
  }

  async locateFilmById(movieId: string) {
    const movieData = await this.movieModel.findOne({ id: movieId }).exec();
    return movieData;
  }
}
