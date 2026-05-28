import { Router } from 'express';
import { getMedications, createMedication, updateMedication, deleteMedication } from '../controllers/medicationController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();
router.use(protect);

router.route('/').get(getMedications).post(createMedication);
router.route('/:id').put(updateMedication).delete(deleteMedication);

export default router;
