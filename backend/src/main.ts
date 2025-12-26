import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from "@nestjs/swagger";
import {swaggerConfig, swaggerUIconfig} from "./config/swagger.config";
import {ConfigService} from "@nestjs/config";
import cookieParser from "cookie-parser";
import {LoggingInterceptor} from "./common/interceptors/logging.interceptor";
import {ResponseInterceptor} from "./common/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: "EShop",
    }),
  });
  const config = app.get(ConfigService);


  app.useGlobalInterceptors(
      new ResponseInterceptor(),
      new LoggingInterceptor()
  )

  app.use(cookieParser())

  app.useGlobalPipes(new ValidationPipe());

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, swaggerUIconfig)


  app.enableCors({
    origin: config.getOrThrow("BACKEND_ALLOWED_ORIGINS"),
    credentials: true,
  })

  await app.listen(3000);
}
bootstrap();
