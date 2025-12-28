import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerUIconfig } from './config/swagger.config';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new ConsoleLogger({
            prefix: 'EShop',
        }),
    });

    const config = app.get(ConfigService);
    const port = 3000;
    const logger = new Logger('Bootstrap');

    app.use(helmet());

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: 'Too many requests from this IP',
        }),
    );

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    app.useGlobalInterceptors(
        new ResponseInterceptor(),
        new LoggingInterceptor(),
    );

    app.use(cookieParser());

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, swaggerDocument, swaggerUIconfig);

    app.enableCors({
        origin: config.getOrThrow<string>('BACKEND_ALLOWED_ORIGINS'),
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cookie',
            'X-Requested-With',
            'Accept'
        ],
        exposedHeaders: [
            'Authorization',
            'Set-Cookie',
            'Access-Control-Allow-Credentials'
        ],
        maxAge: 86400,
    });

    app.setGlobalPrefix('api');

    try {
        await app.listen(port);
    } catch (error) {
        logger.error('Failed to start application:', error);
        process.exit(1);
    }
}

bootstrap();