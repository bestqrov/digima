import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { join } from 'path';

// Configuration
import { appConfig, databaseConfig, jwtConfig, throttleConfig, validate } from './config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { AgenciesModule } from './modules/agencies/agencies.module';
import { UsersModule } from './modules/users/users.module';
import { PlansModule } from './modules/plans/plans.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

// Guards and Interceptors
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';

// Error handling
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

// Default app components
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Static file serving
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/api*', '/health'],
    }),

    // Configuration with validation
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, throttleConfig],
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.local',
        '.env',
      ],
      cache: true,
      expandVariables: true,
      validate,
    }),

    // Rate limiting  
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('throttle.ttl'),
          limit: configService.get<number>('throttle.limit'),
        },
      ],
    }),

    // Database
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('database.uri');
        
        if (!uri) {
          throw new Error('MONGODB_URI is required');
        }
        
        return {
          uri,
          ...configService.get('database.options'),
        };
      },
    }),

    // Feature modules
    AuthModule,
    AgenciesModule, 
    UsersModule,
    PlansModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Global rate limiting
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global authentication
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global tenant isolation
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
})
export class AppModule {}
