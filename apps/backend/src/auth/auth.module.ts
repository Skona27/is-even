import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { AppConfigModule } from '../config/config.module';
import { JwtStrategy } from './jwt.strategy';
import { LoggerModule } from '../logger/logger.module';

@Module({
  providers: [JwtStrategy],
  imports: [
    UserModule,
    LoggerModule,
    AppConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class AuthModule {}
