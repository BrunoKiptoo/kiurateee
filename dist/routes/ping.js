"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const app_1 = require("../app");
const router = (0, express_1.Router)();
router.get("/logs", (_req, res) => {
    const logFilePath = `${app_1.appRoot}/log/activity.log`;
    if (!fs_1.default.existsSync(logFilePath)) {
        return res.status(404).json({ error: `Log file not found at ${logFilePath}` });
    }
    const stream = fs_1.default.createReadStream(logFilePath);
    stream.pipe(res);
});
exports.default = router;
//# sourceMappingURL=ping.js.map