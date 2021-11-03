import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';

import { AppConfigService } from '../config/config.service';
import { User } from '../user/user.entity';
import { LoggerService } from '../logger/logger.service';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: AppConfigService,
    private readonly loggerService: LoggerService,
    private readonly userService: UserService,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.awsConfig.cognito_issuer}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: configService.awsConfig.cognito_issuer,
      algorithms: ['RS256'],
    });
  }

  async validate(payload, done: VerifiedCallback) {
    if (!payload) {
      done(new UnauthorizedException(), false);
    }

    let user: User;

    try {
      user = await this.userService.findUserByAuthId(payload.sub);
    } catch (error) {
      this.loggerService.error(
        `Error while reading user from database (authId: ${payload.sub}). ${error.message}`,
      );
    }

    return done(null, user);
  }
}
