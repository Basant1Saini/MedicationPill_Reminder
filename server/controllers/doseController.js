import DoseLog from '../models/DoseLog.js';
import Medication from '../models/Medication.js';

export const getDoses = async (req, res) => {
  const doses = await DoseLog.find({ userId: req.user._id })
    .populate('medicationId', 'name dosage')
    .sort('-scheduledAt')
    .limit(100);
  res.json(doses);
};

export const logDose = async (req, res) => {
  const { medicationId, reminderId, scheduledAt, status } = req.body;
  const dose = await DoseLog.create({
    userId: req.user._id,
    medicationId,
    reminderId,
    scheduledAt,
    takenAt: status === 'taken' ? new Date() : undefined,
    status,
  });

  if (status === 'taken') {
    const med = await Medication.findById(medicationId);
    if (med && med.stock > 0) {
      med.stock -= 1;
      await med.save();
    }
  }
  res.status(201).json(dose);
};

export const getDoseStats = async (req, res) => {
  const total = await DoseLog.countDocuments({ userId: req.user._id });
  const taken = await DoseLog.countDocuments({ userId: req.user._id, status: 'taken' });
  const missed = await DoseLog.countDocuments({ userId: req.user._id, status: 'missed' });
  const adherence = total > 0 ? Math.round((taken / total) * 100) : 0;
  res.json({ total, taken, missed, adherence });
};
