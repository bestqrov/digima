"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const config_2 = require("./config");
const auth_module_1 = require("./modules/auth/auth.module");
const agencies_module_1 = require("./modules/agencies/agencies.module");
const users_module_1 = require("./modules/users/users.module");
const plans_module_1 = require("./modules/plans/plans.module");
const subscription_module_1 = require("./modules/subscription/subscription.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const tenant_interceptor_1 = require("./common/interceptors/tenant.interceptor");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [config_2.appConfig, config_2.databaseConfig, config_2.jwtConfig, config_2.throttleConfig],
                envFilePath: [
                    `.env.${process.env.NODE_ENV || 'development'}`,
                    '.env.local',
                    '.env',
                ],
                cache: true,
                expandVariables: true,
                validate: config_2.validate,
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => [
                    {
                        ttl: configService.get('throttle.ttl'),
                        limit: configService.get('throttle.limit'),
                    },
                ],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const uri = configService.get('database.uri');
                    if (!uri) {
                        throw new Error('MONGODB_URI is required');
                    }
                    return {
                        uri,
                        ...configService.get('database.options'),
                    };
                },
            }),
            auth_module_1.AuthModule,
            agencies_module_1.AgenciesModule,
            users_module_1.UsersModule,
            plans_module_1.PlansModule,
            subscription_module_1.SubscriptionModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_FILTER,
                useClass: all_exceptions_filter_1.AllExceptionsFilter,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: tenant_interceptor_1.TenantInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map