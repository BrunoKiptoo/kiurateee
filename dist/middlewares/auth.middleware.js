"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1]; // Extract token from the header
    if (!token)
        return res.sendStatus(401); // Unauthorized
    const secret = process.env.JWT_SECRET; // Get secret from environment variables
    if (!secret) {
        return res.status(500).json({ message: "JWT secret is not defined." });
    }
    jsonwebtoken_1.default.verify(token, secret, (err, user) => {
        if (err)
            return res.sendStatus(403); // Forbidden
        // Cast user to UserPayload to access id safely
        req.user = user; // Set user information to req.user
        next();
    });
};
exports.default = authenticateToken;
//# sourceMappingURL=auth.middleware.js.map