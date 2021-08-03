import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CognitoModule } from '../cognito/cognito.module';
import { User } from './user.entity';
import { LoggerModule } from '../logger/logger.module';

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), CognitoModule, LoggerModule],
})
export class UserModule {}
