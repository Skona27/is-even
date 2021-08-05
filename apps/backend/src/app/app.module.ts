import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsSdkModule } from 'nest-aws-sdk';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from '../config/config.service';
import { AppConfigModule } from '../config/config.module';
import { UserModule } from '../user/user.module';
import { LoggerModule } from '../logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { ApiKeyModule } from '../api-key/api-key.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => {
        return configService.databaseConfig;
      },
    }),
    AwsSdkModule.forRootAsync({
      defaultServiceOptions: {
        useFactory: (configService: AppConfigService) => {
          return {
            region: configService.awsConfig.region,
          };
        },
        inject: [AppConfigService],
        imports: [AppConfigModule],
      },
      services: [CognitoIdentityServiceProvider],
    }),
    AppConfigModule,
    LoggerModule,
    UserModule,
    AuthModule,
    ApiKeyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
