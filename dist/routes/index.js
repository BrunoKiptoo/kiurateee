"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initializeRoutes;
const constants_1 = require("../config/constants");
const category_routes_1 = __importDefault(require("./category.routes"));
const video_routes_1 = __importDefault(require("./video.routes"));
const ping_1 = __importDefault(require("./ping"));
function initializeRoutes(app) {
    app.use(`/api/${constants_1.appVersion}/ping`, ping_1.default);
    app.use(`/api/${constants_1.appVersion}/categories`, category_routes_1.default);
    app.use(`/api/${constants_1.appVersion}/videos`, video_routes_1.default);
}
//# sourceMappingURL=index.js.map