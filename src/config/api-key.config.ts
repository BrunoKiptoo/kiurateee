//src/config/api-key.config.ts

import { NextFunction, Request, Response } from "express";
import { API_KEY } from "./env";

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
