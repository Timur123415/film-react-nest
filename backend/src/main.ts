import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppConfig } from './app.config.provider';

async function bootstrap() {
  const appConfig: AppConfig = {
    database: {
      driver:
        (process.env.DATABASE_DRIVER as 'postgres' | 'mongodb') || 'postgres',
      postgres: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'root',
        db: process.env.POSTGRES_DB || 'afisha',
      },
      mongoUrl: process.env.DATABASE_URL,
    },
  };

  const app = await NestFactory.create(AppModule.register(appConfig));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
