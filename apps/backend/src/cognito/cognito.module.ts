import { Module } from '@nestjs/common';

import { AppConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';
import { CognitoService } from './cognito.service';

@Module({
  providers: [CognitoService],
  exports: [CognitoService],
  imports: [LoggerModule, AppConfigModule],
})
export class CognitoModule {}
