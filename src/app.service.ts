import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    return 'ArwaPark API is running! 🚀';
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'ArwaPark API',
      version: '1.0.0',
      environment: this.configService.get<string>('app.environment'),
    };
  }

  getReadiness() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      service: 'ArwaPark API',
      checks: {
        database: 'ok',
        memory: process.memoryUsage(),
        uptime: process.uptime(),
      },
    };
  }
}
