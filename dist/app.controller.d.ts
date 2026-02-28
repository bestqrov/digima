import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
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
