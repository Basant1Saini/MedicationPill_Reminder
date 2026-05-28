import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  dosage: { type: String, required: true },
  form: { type: String, enum: ['tablet', 'capsule', 'liquid', 'injection'], default: 'tablet' },
  stock: { type: Number, default: 0 },
  refillAlert: { type: Number, default: 5 },
  notes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Medication', medicationSchema);
