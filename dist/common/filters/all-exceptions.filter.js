"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor() {
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = this.getHttpStatus(exception);
        const message = this.getErrorMessage(exception);
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: this.isProduction() ? this.getProductionMessage(status) : message,
            ...(this.isDevelopment() && { error: this.getErrorDetails(exception) }),
        };
        const logMessage = `${request.method} ${request.url} - Status: ${status} - Message: ${message}`;
        if (status >= 500) {
            this.logger.error(logMessage, exception);
        }
        else {
            this.logger.warn(logMessage);
        }
        response.status(status).json(errorResponse);
    }
    getHttpStatus(exception) {
        if (exception instanceof common_1.HttpException) {
            return exception.getStatus();
        }
        return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
    }
    getErrorMessage(exception) {
        if (exception instanceof common_1.HttpException) {
            const response = exception.getResponse();
            if (typeof response === 'string') {
                return response;
            }
            if (typeof response === 'object' && response !== null) {
                return response.message || 'Unknown error';
            }
        }
        if (exception instanceof Error) {
            return exception.message;
        }
        return 'Internal server error';
    }
    getErrorDetails(exception) {
        if (exception instanceof Error) {
            return {
                name: exception.name,
                stack: exception.stack,
            };
        }
        return exception;
    }
    getProductionMessage(status) {
        switch (true) {
            case status >= 500:
                return 'Internal server error';
            case status >= 400:
                return 'Bad request';
            default:
                return 'An error occurred';
        }
    }
    isProduction() {
        return process.env.NODE_ENV === 'production';
    }
    isDevelopment() {
        return process.env.NODE_ENV === 'development';
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map