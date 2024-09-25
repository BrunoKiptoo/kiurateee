import { Router } from "express";
import { validateApiKey } from "../config/api-key.config";
import { videoValidator } from "../middlewares/validators/video.validators";
import { validate } from "../middlewares/validate-request";
import { createVideo, getAllVideos } from "../controllers/videos.controller";

const router = Router();

router.post("/video", validateApiKey, videoValidator, validate, createVideo);
router.get("/all", validateApiKey, getAllVideos);

export default router;
