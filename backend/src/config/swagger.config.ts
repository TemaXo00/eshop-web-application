import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle('ESHop API')
    .setVersion('1.0.0')
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        },
        'JWT-auth',
    )
    .setDescription('ESHop API for MITSO Laboratories')
    .setContact(
        'TemaXo00',
        'https://github.com/TemaXo00/',
        'melnikov.artem294@gmail.com',
    )
    .build();

export const swaggerUIconfig: SwaggerCustomOptions = {
    swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
        displayRequestDuration: true,
        operationsSorter: (a: { get: (arg0: string) => string; }, b: { get: (arg0: string) => string; }) => {
            const methodOrder = {
                'get': 1,
                'post': 2,
                'put': 3,
                'patch': 4,
                'delete': 5,
                'head': 6,
                'options': 7,
                'trace': 8
            };
            const methodA = a.get('method').toLowerCase();
            const methodB = b.get('method').toLowerCase();

            return methodOrder[methodA] - methodOrder[methodB];
        },
        tagsSorter: 'alpha'
    },
    customSiteTitle: 'ESHop API Documentation',
    customCss: '.swagger-ui .topbar {display: none !important;}',

    jsonDocumentUrl: 'docs/swagger.json',
    yamlDocumentUrl: 'docs/swagger.yaml',
};