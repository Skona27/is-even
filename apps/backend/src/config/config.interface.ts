import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface Config {
  appConfig: {
    port: string;
    version: string;
  };
  swaggerConfig: {
    title: string;
    version: string;
    description: string;
    enabled: boolean;
  };
  databaseConfig: TypeOrmModuleOptions;
}
