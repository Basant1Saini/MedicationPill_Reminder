import { Router } from 'express';
import { getDoses, logDose, getDoseStats } from '../controllers/doseController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);

router.get('/', getDoses);
router.post('/log', logDose);
router.get('/stats', getDoseStats);

export default router;
