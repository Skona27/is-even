import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '../logger/logger.module';
import { ApiKeyController } from './api-key.controller';
import { ApiKey } from './api-key.entity';
import { ApiKeyService } from './api-key.service';

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
  exports: [ApiKeyService],
  imports: [LoggerModule, TypeOrmModule.forFeature([ApiKey])],
})
export class ApiKeyModule {}
