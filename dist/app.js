"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRoot = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../.env") });
const error_1 = require("./helpers/error");
const httpLogger_1 = __importDefault(require("./middlewares/httpLogger"));
const database_1 = require("./config/database");
exports.appRoot = path_1.default.resolve();
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(httpLogger_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
(0, routes_1.default)(app);
// catch 404 and forward to error handler
app.use((req, res) => {
    var _a;
    const method = req.method;
    res.status(404).json({
        status: "error",
        message: "Route Not Found",
        error: `Cannot ${method} ${((_a = req.url) === null || _a === void 0 ? void 0 : _a.split("api/v1")[1]) || ""}`,
    });
});
// error handler
const errorHandler = (err, _req, res, _next) => {
    (0, error_1.handleError)(err, res);
};
app.use(errorHandler);
const port = process.env.PORT || "8000";
app.set("port", port);
const server = http_1.default.createServer(app);
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            process.exit(1);
            break;
        case "EADDRINUSE":
            process.exit(1);
            break;
        default:
            throw error;
    }
}
async function onListening() {
    await (0, database_1.connectDB)();
    const addr = server.address();
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr === null || addr === void 0 ? void 0 : addr.port}`;
    console.info(`Server is listening on ${bind}`);
}
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
//# sourceMappingURL=app.js.map