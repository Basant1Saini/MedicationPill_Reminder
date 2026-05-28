import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
  times: [{ type: String }],
  days: [{ type: String }],
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  notifyVia: [{ type: String, enum: ['push', 'email'] }],
}, { timestamps: true });

export default mongoose.model('Reminder', reminderSchema);
