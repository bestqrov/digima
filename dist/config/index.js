"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.throttleConfig = exports.jwtConfig = exports.databaseConfig = exports.appConfig = void 0;
const app_config_1 = require("./app.config");
exports.appConfig = app_config_1.default;
const database_config_1 = require("./database.config");
exports.databaseConfig = database_config_1.default;
const jwt_config_1 = require("./jwt.config");
exports.jwtConfig = jwt_config_1.default;
const throttle_config_1 = require("./throttle.config");
exports.throttleConfig = throttle_config_1.default;
var env_validation_1 = require("./env.validation");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return env_validation_1.validate; } });
//# sourceMappingURL=index.js.map