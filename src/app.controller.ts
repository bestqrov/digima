import { Controller, Get, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'ArwaPark API Welcome' })
  @ApiResponse({ status: 200, description: 'API information and links' })
  getWelcome() {
    return {
      name: 'ArwaPark SaaS API',
      description: 'Multi-tenant SaaS for tourist transport agencies',
      version: '1.0.0',
      status: 'online',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/health',
        api_documentation: '/api/docs',
        api_base: '/api/v1',
        authentication: '/api/v1/auth',
        agencies: '/api/v1/agencies',
        users: '/api/v1/users',
        vehicles: '/api/v1/vehicles',
        trips: '/api/v1/trips'
      },
      links: {
        documentation: 'https://arwapark.digima.cloud/api/docs',
        health_check: 'https://arwapark.digima.cloud/health'
      }
    };
  }

  @Public()
  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Get application status' })
  @ApiResponse({ status: 200, description: 'Application is running' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  @Version('1')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service health status' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Public()
  @Get('readiness')
  @Version('1')
  @ApiOperation({ summary: 'Readiness check endpoint' })
  @ApiResponse({ status: 200, description: 'Service readiness status' })
  getReadiness() {
    return this.appService.getReadiness();
  }
}
