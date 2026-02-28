"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const helmet_1 = require("helmet");
const compression_1 = require("compression");
const express_rate_limit_1 = require("express-rate-limit");
const cookie_parser_1 = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: process.env.NODE_ENV === 'production'
            ? ['error', 'warn']
            : ['error', 'warn', 'log', 'debug'],
        abortOnError: false,
    });
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    const port = configService.get('app.port') || 3000;
    const environment = configService.get('app.environment');
    app.use((0, helmet_1.default)({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [`'self'`],
                styleSrc: [`'self'`, `'unsafe-inline'`],
                scriptSrc: [`'self'`],
                objectSrc: [`'none'`],
                upgradeInsecureRequests: [],
            },
        },
    }));
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: environment === 'production',
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const corsOrigins = configService.get('app.corsOrigins');
    app.enableCors({
        origin: corsOrigins,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-agency-id'],
        credentials: true,
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        prefix: 'v',
        defaultVersion: '1',
    });
    app.setGlobalPrefix('api');
    if (environment !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('ArwaPark API')
            .setDescription('Multi-tenant SaaS for tourist transport agencies')
            .setVersion('1.0')
            .addBearerAuth({
            description: 'JWT Authorization header using the Bearer scheme.',
            name: 'Authorization',
            bearerFormat: 'Bearer',
            scheme: 'Bearer',
            type: 'http',
            in: 'Header',
        }, 'access-token')
            .addApiKey({
            type: 'apiKey',
            name: 'x-agency-id',
            in: 'header',
            description: 'Agency ID for multi-tenant access',
        }, 'agency-id')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config, {
            operationIdFactory: (controllerKey, methodKey) => methodKey,
        });
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        });
        logger.log(`📚 API Documentation available at: /api/docs`);
    }
    app.getHttpAdapter().get('/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            version: '1.0.0',
        });
    });
    const shutdown = async (signal) => {
        logger.log(`📴 Received ${signal}. Shutting down gracefully...`);
        setTimeout(() => {
            logger.error('❌ Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
        await app.close();
        process.exit(0);
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('uncaughtException', (error) => {
        logger.error('❌ Uncaught Exception:', error);
        process.exit(1);
    });
    process.on('unhandledRejection', (error) => {
        logger.error('❌ Unhandled Rejection:', error);
        process.exit(1);
    });
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 ArwaPark API is running on port: ${port}`);
    logger.log(`🌍 Environment: ${environment}`);
    if (environment !== 'production') {
        logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
        logger.log(`🔍 Health Check: http://localhost:${port}/api/v1/health`);
    }
}
bootstrap().catch((error) => {
    console.error('❌ Error starting server:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map