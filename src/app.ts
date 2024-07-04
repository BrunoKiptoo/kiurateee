import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import helmet from "helmet";
import cors from "cors";

dotenv.config({ path: path.join(__dirname, "../.env") });
import { handleError } from "./helpers/error";
import httpLogger from "./middlewares/httpLogger";
import { connectDB } from "./config/database";

export const appRoot = path.resolve();
import initializeRoutes from "./routes";

const app: express.Application = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

initializeRoutes(app);

// catch 404 and forward to error handler
app.use((req: Request, res: Response) => {
  const method = req.method;
  res.status(404).json({
    status: "error",
    message: "Route Not Found",
    error: `Cannot ${method} ${req.url?.split("api/v1")[1] || ""}`,
  });
});

// error handler
const errorHandler: express.ErrorRequestHandler = (err, _req, res, _next) => {
  handleError(err, res);
};
app.use(errorHandler);

const port = process.env.PORT || "8000";
app.set("port", port);

const server = http.createServer(app);

function onError(error: { syscall: string; code: string }) {
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
  await connectDB();
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
  console.info(`Server is listening on ${bind}`);
}

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
