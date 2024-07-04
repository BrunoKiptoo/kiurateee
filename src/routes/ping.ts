import { Router } from "express";
import fs from "fs";
import { appRoot } from "../app";

const router = Router();

router.get("/logs", (_req, res) => {
  const logFilePath = `${appRoot}/log/activity.log`;

  if (!fs.existsSync(logFilePath)) {
    return res.status(404).json({ error: `Log file not found at ${logFilePath}` });
  }

  const stream = fs.createReadStream(logFilePath);
  stream.pipe(res);
});

export default router;
