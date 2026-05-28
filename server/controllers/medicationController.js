import Medication from '../models/Medication.js';

export const getMedications = async (req, res) => {
  const medications = await Medication.find({ userId: req.user._id }).sort('-createdAt');
  res.json(medications);
};

export const createMedication = async (req, res) => {
  const medication = await Medication.create({ ...req.body, userId: req.user._id });
  res.status(201).json(medication);
};

export const updateMedication = async (req, res) => {
  const medication = await Medication.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!medication) return res.status(404).json({ message: 'Medication not found' });
  res.json(medication);
};

export const deleteMedication = async (req, res) => {
  const medication = await Medication.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!medication) return res.status(404).json({ message: 'Medication not found' });
  res.json({ message: 'Medication deleted' });
};
