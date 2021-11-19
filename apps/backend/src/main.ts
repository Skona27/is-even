import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

import { AppModule } from './app/app.module';
import { AppConfigService } from './config/config.service';
import { webhookRawBodyMiddleware } from './common/middlewere/webhook-raw-body.middlewere';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());
  app.use(webhookRawBodyMiddleware());

  const config = app.get(AppConfigService);

  if (config.appConfig.cors) {
    app.enableCors();
  }
  if (config.appConfig.behindProxy) {
    app.set('trust proxy', 1);
  }

  app.use(
    rateLimit({
      windowMs: config.rateLimitConfig.ttlMs,
      max: config.rateLimitConfig.maxRequests,
    }),
  );

  if (config.swaggerConfig.enabled) {
    const swaggerParams = new DocumentBuilder()
      .setTitle(config.swaggerConfig.title)
      .setDescription(config.swaggerConfig.description)
      .setVersion(config.swaggerConfig.version)
      .build();

    const document = SwaggerModule.createDocument(app, swaggerParams);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
