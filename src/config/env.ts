//src/config/env.ts

import dotenv from "dotenv";
import { IEnv } from "../interface/interfaces";

dotenv.config();

export const nodeEnv = process.env.NODE_ENV;

// APP URL
export const baseApiURL = process.env.BASE_API_URL;

// MONGO
export const mongoURI = process.env.MONGO_URI;

// API KEY
export const API_KEY = process.env.API_KEY;

// MAILGUN
// export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
// export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

// PAYSTACK
// export const PAYSTACK_NG_SECRET_KEY = process.env.PAYSTACK_NG_SECRET_KEY;

// AUTHENTICATION
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const ACCESS_TOKEN_EXPIRY = process.env.AUTH_ACCESS_TOKEN_EXPIRY as string;
export const REFRESH_TOKEN_EXPIRY = process.env.AUTH_REFRESH_TOKEN_EXPIRY as string;

// INFOBIP
// export const INFOBIP_KEY = process.env.INFOBIP_API_KEY;
// export const INFOBIP_BASE_URL = process.env.INFOBIP_API_BASE_URL;

// AWS Configuration
export const bucketName = process.env.AWS_BUCKET_NAME;
export const accessKey = process.env.AWS_ACCESS_KEY;
export const secretKey = process.env.AWS_SECRET_KEY;

(() => {
  const requiredEnvs: IEnv = {
    nodeEnv,
    // mongoURI,
    baseApiURL,
    // MAILGUN_API_KEY,
    // MAILGUN_DOMAIN,
    // PAYSTACK_NG_SECRET_KEY,
    API_KEY,
    JWT_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    bucketName,
    accessKey,
    secretKey,
  };

  const missing = Object.keys(requiredEnvs)
    .map((variable) => {
      if (!requiredEnvs[variable as keyof typeof requiredEnvs]) return variable;
      return "";
    })
    .filter((val) => val.length);

  if (missing.length) console.error("[MISSING ENV VARIABLES]:\n", missing);
})();
