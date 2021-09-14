import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app/app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(AppConfigService);

  if (config.appConfig.cors) {
    app.enableCors();
  }

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
