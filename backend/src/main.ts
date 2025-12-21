import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import {swaggerConfig, swaggerUIconfig} from "./config/swagger.config";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, swaggerUIconfig)

  app.enableCors({
    origin: config.getOrThrow("BACKEND_ALLOWED_ORIGINS"),
  })

  await app.listen(3000);
}
bootstrap();
