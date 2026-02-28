import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn'] 
      : ['error', 'warn', 'log', 'debug'],
    abortOnError: false,
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  const port = configService.get<number>('app.port') || 3000;
  const environment = configService.get<string>('app.environment');

  // Security middleware
  app.use(helmet({
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

  // Compression middleware
  app.use(compression());

  // Cookie parser
  app.use(cookieParser());

  // Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    disableErrorMessages: environment === 'production',
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // CORS configuration  
  const corsOrigins = configService.get<string[]>('app.corsOrigins');
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-agency-id'],
    credentials: true,
  });

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger documentation 
  const config = new DocumentBuilder()
    .setTitle('ArwaPark API')
    .setDescription('Multi-tenant SaaS for tourist transport agencies')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'JWT Authorization header using the Bearer scheme.',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-agency-id',
        in: 'header',
        description: 'Agency ID for multi-tenant access',
      },
      'agency-id',
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  logger.log(`📚 API Documentation available at: https://arwapark.digima.cloud/api/docs`);

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: '1.0.0',
    });
  });

  // Login page route
  app.getHttpAdapter().get('/login', (req, res) => {
    res.sendFile('login.html', { root: './public' });
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
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

  // Start server
  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 ArwaPark API is running on port: ${port}`);
  logger.log(`🌍 Environment: ${environment}`);
  
  if (environment === 'production') {
    logger.log(`🌐 API Base: https://arwapark.digima.cloud/api/v1`);
    logger.log(`📚 API Documentation: https://arwapark.digima.cloud/api/docs`);
    logger.log(`🔍 Health Check: https://arwapark.digima.cloud/health`);
  } else {
    logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    logger.log(`🔍 Health Check: http://localhost:${port}/api/v1/health`);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});
