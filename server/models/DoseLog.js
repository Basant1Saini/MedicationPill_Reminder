import mongoose from 'mongoose';

const doseLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  reminderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reminder' },
  scheduledAt: { type: Date, required: true },
  takenAt: { type: Date },
  status: { type: String, enum: ['taken', 'missed', 'snoozed'], required: true },
}, { timestamps: true });

export default mongoose.model('DoseLog', doseLogSchema);
