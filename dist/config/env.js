"use strict";
//src/config/env.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretKey = exports.accessKey = exports.bucketName = exports.REFRESH_TOKEN_EXPIRY = exports.ACCESS_TOKEN_EXPIRY = exports.JWT_SECRET = exports.API_KEY = exports.mongoURI = exports.baseApiURL = exports.nodeEnv = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.nodeEnv = process.env.NODE_ENV;
// APP URL
exports.baseApiURL = process.env.BASE_API_URL;
// MONGO
exports.mongoURI = process.env.MONGO_URI;
// API KEY
exports.API_KEY = process.env.API_KEY;
// MAILGUN
// export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
// export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
// PAYSTACK
// export const PAYSTACK_NG_SECRET_KEY = process.env.PAYSTACK_NG_SECRET_KEY;
// AUTHENTICATION
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.ACCESS_TOKEN_EXPIRY = process.env.AUTH_ACCESS_TOKEN_EXPIRY;
exports.REFRESH_TOKEN_EXPIRY = process.env.AUTH_REFRESH_TOKEN_EXPIRY;
// INFOBIP
// export const INFOBIP_KEY = process.env.INFOBIP_API_KEY;
// export const INFOBIP_BASE_URL = process.env.INFOBIP_API_BASE_URL;
// AWS Configuration
exports.bucketName = process.env.AWS_BUCKET_NAME;
exports.accessKey = process.env.AWS_ACCESS_KEY;
exports.secretKey = process.env.AWS_SECRET_KEY;
(() => {
    const requiredEnvs = {
        nodeEnv: exports.nodeEnv,
        // mongoURI,
        baseApiURL: exports.baseApiURL,
        // MAILGUN_API_KEY,
        // MAILGUN_DOMAIN,
        // PAYSTACK_NG_SECRET_KEY,
        API_KEY: exports.API_KEY,
        JWT_SECRET: exports.JWT_SECRET,
        ACCESS_TOKEN_EXPIRY: exports.ACCESS_TOKEN_EXPIRY,
        REFRESH_TOKEN_EXPIRY: exports.REFRESH_TOKEN_EXPIRY,
        bucketName: exports.bucketName,
        accessKey: exports.accessKey,
        secretKey: exports.secretKey,
    };
    const missing = Object.keys(requiredEnvs)
        .map((variable) => {
        if (!requiredEnvs[variable])
            return variable;
        return "";
    })
        .filter((val) => val.length);
    if (missing.length)
        console.error("[MISSING ENV VARIABLES]:\n", missing);
})();
//# sourceMappingURL=env.js.map