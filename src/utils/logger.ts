import winston from "winston";
import { nodeEnv } from "../config/env";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const includeUser = winston.format((info, opts) => {
  if (opts.user && opts.user.id) {
    info.user_id = opts.user.id;
  }
  return info;
});

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  includeUser(),
  winston.format.simple(),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.user_id ? `User ID: ${info.user_id}, ` : ""}${info.message}`),
);

const fileName = nodeEnv === "production" ? "log/activity.log" : "log/activity-dev.log";

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize({ all: true }), format),
  }),
  new winston.transports.File({ filename: fileName, format }),
];

const Logger = winston.createLogger({
  levels,
  format,
  transports,
});

export default Logger;
