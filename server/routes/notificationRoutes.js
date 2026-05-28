import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = Router();
router.use(protect);

router.post('/subscribe', async (req, res) => {
  req.user.pushSubscription = req.body;
  await req.user.save();
  res.json({ message: 'Subscribed to push notifications' });
});

router.delete('/unsubscribe', async (req, res) => {
  req.user.pushSubscription = null;
  await req.user.save();
  res.json({ message: 'Unsubscribed from push notifications' });
});

export default router;
