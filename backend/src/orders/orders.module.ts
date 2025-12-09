import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film, FilmSchema } from '../films/film.schema';
import { FilmEntity } from '../films/entities/film.entity';
import { ScheduleEntity } from 'src/films/entities/schedule.entity';
import { FilmsModule } from 'src/films/films.module';
import { AppConfigModule } from 'src/app.config.provider';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';
import { MongoOrdersRepository } from '../repository/implementations/orders-mongo.repository';
import { PostgresOrdersRepository } from '../repository/implementations/orders-postgres.repository';
import { ORDERS_REPOSITORY_TOKEN } from '../repository/interfaces/orders-repository.interface';

@Module({})
export class OrderModule {
  static registerAsync(dbType: string): DynamicModule {
    const isSql = dbType === 'postgres';
    const RepositoryClass = isSql
      ? PostgresOrdersRepository
      : MongoOrdersRepository;

    const dbImports = isSql
      ? TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])
      : MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]);

    const repoProvider: Provider = {
      provide: ORDERS_REPOSITORY_TOKEN,
      useClass: RepositoryClass,
    };

    return {
      module: OrderModule,
      imports: [AppConfigModule, FilmsModule.registerAsync(dbType), dbImports],
      controllers: [OrderController],
      providers: [OrderService, RepositoryClass, repoProvider],
      exports: [OrderService],
    };
  }
}
