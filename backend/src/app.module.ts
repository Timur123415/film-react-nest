import { DynamicModule, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './orders/orders.module';
import { AppConfig, AppConfigModule } from './app.config.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from './films/entities/film.entity';
import { ScheduleEntity } from './films/entities/schedule.entity';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

@Module({})
export class AppModule {
  static register(config: AppConfig): DynamicModule {
    const ormModule =
      config.database.driver === 'postgres'
        ? TypeOrmModule.forRoot({
            type: 'postgres',
            host: config.database.postgres.host,
            port: config.database.postgres.port,
            username: config.database.postgres.user,
            password: config.database.postgres.password,
            database: config.database.postgres.db,
            synchronize: false,
            entities: [FilmEntity, ScheduleEntity],
          })
        : MongooseModule.forRoot(config.database.mongoUrl);
    return {
      module: AppModule,
      imports: [
        AppConfigModule,
        ServeStaticModule.forRoot({
          rootPath: path.join(process.cwd(), 'public'),
          serveRoot: '/',
        }),
        ormModule,
        FilmsModule.registerAsync(config.database.driver),
        OrderModule.registerAsync(config.database.driver),
      ],
    };
  }
}
