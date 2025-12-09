import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film, FilmSchema } from './film.schema';
import { FilmEntity } from './entities/film.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { PostgresFilmsRepository } from 'src/repository/implementations/films-postgres.repository';
import { MongoFilmsRepository } from 'src/repository/implementations/films-mongo.repository';
import { FILMS_REPOSITORY_TOKEN } from 'src/repository/interfaces/films-repository.interface';
import { AppConfigModule } from 'src/app.config.provider';

@Module({})
export class FilmsModule {
  static registerAsync(dbType: string): DynamicModule {
    const isSql = dbType === 'postgres';

    const databaseImports = isSql
      ? [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])]
      : [MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }])];

    const RepositoryClass = isSql
      ? PostgresFilmsRepository
      : MongoFilmsRepository;
    const repositoryProvider: Provider = {
      provide: FILMS_REPOSITORY_TOKEN,
      useClass: RepositoryClass,
    };

    return {
      module: FilmsModule,
      imports: [AppConfigModule, ...databaseImports],
      controllers: [FilmsController],
      providers: [FilmsService, RepositoryClass, repositoryProvider],
      exports: [FilmsService, FILMS_REPOSITORY_TOKEN],
    };
  }
}
