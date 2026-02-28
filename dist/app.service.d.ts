import { ConfigService } from '@nestjs/config';
export declare class AppService {
    private readonly configService;
    constructor(configService: ConfigService);
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
        service: string;
        version: string;
        environment: string;
    };
    getReadiness(): {
        status: string;
        timestamp: string;
        service: string;
        checks: {
            database: string;
            memory: NodeJS.MemoryUsage;
            uptime: number;
        };
    };
}
