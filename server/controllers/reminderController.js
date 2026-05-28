import Reminder from '../models/Reminder.js';

export const getReminders = async (req, res) => {
  const reminders = await Reminder.find({ userId: req.user._id }).populate('medicationId', 'name dosage');
  res.json(reminders);
};

export const createReminder = async (req, res) => {
  const reminder = await Reminder.create({ ...req.body, userId: req.user._id });
  res.status(201).json(reminder);
};

export const updateReminder = async (req, res) => {
  const reminder = await Reminder.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
  res.json(reminder);
};

export const deleteReminder = async (req, res) => {
  const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
  res.json({ message: 'Reminder deleted' });
};

export const toggleReminder = async (req, res) => {
  const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
  if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
  reminder.isActive = !reminder.isActive;
  await reminder.save();
  res.json(reminder);
};
