"use strict";
//src/config/api-key.config.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiKey = void 0;
const env_1 = require("./env");
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== env_1.API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};
exports.validateApiKey = validateApiKey;
//# sourceMappingURL=api-key.config.js.map