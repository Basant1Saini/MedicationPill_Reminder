import { Router } from 'express';
import { getReminders, createReminder, updateReminder, deleteReminder, toggleReminder } from '../controllers/reminderController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);

router.route('/').get(getReminders).post(createReminder);
router.route('/:id').put(updateReminder).delete(deleteReminder);
router.patch('/:id/toggle', toggleReminder);

export default router;
