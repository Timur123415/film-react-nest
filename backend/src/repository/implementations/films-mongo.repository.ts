import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from 'src/films/film.schema';
import { CreateFilmDto } from '../../films/dto/film.dto';
import { IFilmsRepository } from '../interfaces/films-repository.interface';

@Injectable()
export class MongoFilmsRepository implements IFilmsRepository {
  constructor(
    @InjectModel(Film.name)
    private readonly model: Model<Film>,
  ) {}

  public async findAll(): Promise<Film[]> {
    const items = await this.model.find().exec();
    return items;
  }

  public async findById(filmId: string): Promise<Film | null> {
    const item = await this.model.findOne({ id: filmId }).exec();
    return item;
  }

  public async create(payload: CreateFilmDto): Promise<Film> {
    const newEntry = new this.model(payload);
    const savedEntry = await newEntry.save();

    return savedEntry;
  }
}
