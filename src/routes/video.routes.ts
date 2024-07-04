import { Router } from 'express';
import { createVideo, getMyVideos, getVideos, searchVideos } from '../controllers/videos.controller';
import { createVideoValidator } from '../middlewares/validators/video.validators';


const router = Router();

router.post('/new_video', createVideoValidator, createVideo);
router.get('/all', getVideos);
router.get('/my_videos/:userId', getMyVideos);
router.get('/search', searchVideos);

export default router;
