import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: unknown, host: ArgumentsHost): void;
    private getHttpStatus;
    private getErrorMessage;
    private getErrorDetails;
    private getProductionMessage;
    private isProduction;
    private isDevelopment;
}
