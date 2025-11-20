import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, Provider } from '@nestjs/common';

export interface AppConfigDatabase {
  driver: 'postgres' | 'mongodb';
  postgres?: {
    host: string;
    port: number;
    user: string;
    password: string;
    db: string;
  };
  mongoUrl?: string;
}

export interface AppConfig {
  database: AppConfigDatabase;
}

export const configProvider: Provider = {
  provide: 'APP_CONFIG',
  inject: [ConfigService],
  useFactory: (config: ConfigService): AppConfig => {
    const driver = config.get<string>('DATABASE_DRIVER') as
      | 'postgres'
      | 'mongodb';

    if (!driver) {
      throw new Error('DATABASE_DRIVER не задан в .env файле');
    }

    const database: AppConfigDatabase = {
      driver: driver,
      postgres: {
        host: config.get<string>('POSTGRES_HOST'),
        port: config.get<number>('POSTGRES_PORT'),
        user: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        db: config.get<string>('POSTGRES_DB'),
      },
      mongoUrl: config.get<string>('DATABASE_URL'),
    };

    return { database };
  },
};

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [configProvider],
  exports: [ConfigModule, configProvider],
})
export class AppConfigModule {}
