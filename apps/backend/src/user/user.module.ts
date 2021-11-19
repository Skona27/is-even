import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { CognitoModule } from '../cognito/cognito.module';
import { LoggerModule } from '../logger/logger.module';
import { SentryModule } from '../sentry/sentry.module';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
  imports: [
    TypeOrmModule.forFeature([User]),
    CognitoModule,
    LoggerModule,
    SentryModule,
  ],
})
export class UserModule {}
