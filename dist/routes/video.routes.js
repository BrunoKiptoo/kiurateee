"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videos_controller_1 = require("../controllers/videos.controller");
const video_validators_1 = require("../middlewares/validators/video.validators");
const router = (0, express_1.Router)();
router.post('/new_video', video_validators_1.createVideoValidator, videos_controller_1.createVideo);
router.get('/all', videos_controller_1.getVideos);
router.get('/my_videos/:userId', videos_controller_1.getMyVideos);
router.get('/search', videos_controller_1.searchVideos);
exports.default = router;
//# sourceMappingURL=video.routes.js.map