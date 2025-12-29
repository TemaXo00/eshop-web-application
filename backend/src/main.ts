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
import {isDev} from "./common/utils/is-dev.util";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new ConsoleLogger({
            prefix: 'EShop',
        }),
    });

    const config = app.get(ConfigService);
    const port = 3000;
    const logger = new Logger('Bootstrap');

    app.use(helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "validator.swagger.io"],
                scriptSrc: ["'self'", "https: 'unsafe-inline'"],
            },
        },
    }));

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            limit: 100,
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

    if (isDev(config)) {
        const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('docs', app, swaggerDocument, swaggerUIconfig);
    }

    const allowedOrigins = config.getOrThrow<string>('BACKEND_ALLOWED_ORIGINS').split(',').map(o => o.trim());

    app.enableCors({
        origin: allowedOrigins,
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
        logger.log(`App mode: ${isDev(config) ? 'DEV': 'PROD'}`);
        isDev(config) ? logger.log(`Swagger docs: /api/docs`) : logger.log(`To enable Swagger docs, enable app in DEV mode`)
    } catch (error) {
        logger.error('Failed to start application:', error);
        process.exit(1);
    }
}

bootstrap();