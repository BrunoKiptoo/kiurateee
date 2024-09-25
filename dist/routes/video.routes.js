"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_key_config_1 = require("../config/api-key.config");
const video_validators_1 = require("../middlewares/validators/video.validators");
const validate_request_1 = require("../middlewares/validate-request");
const videos_controller_1 = require("../controllers/videos.controller");
const router = (0, express_1.Router)();
router.post("/video", api_key_config_1.validateApiKey, video_validators_1.videoValidator, validate_request_1.validate, videos_controller_1.createVideo);
router.get("/all", api_key_config_1.validateApiKey, videos_controller_1.getAllVideos);
exports.default = router;
//# sourceMappingURL=video.routes.js.map