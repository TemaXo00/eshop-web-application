import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
      .setTitle('ESHop API')
      .setVersion('1.0.0')
      .setDescription('ESHop API for MITSO Laboratories')
      .setContact('TemaXo00', 'https://github.com/TemaXo00/', 'melnikov.artem294@gmail.com')
      .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: true,
    deepScanRoutes: true,
  });

  SwaggerModule.setup('/docs', app, document, {
    explorer: true,
    customSiteTitle: 'ESHop API Documentation',
    jsonDocumentUrl: "docs/swagger.json",
    yamlDocumentUrl: "docs/swagger.yaml",
  });

  await app.listen(3000);
}
bootstrap();
