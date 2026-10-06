import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  userId: string;
  label: string;
  address: string;
  phone: string;
  notes?: string;
}

const AddressSchema: Schema = new Schema({
  userId: { type: String, required: true },
  label: { type: String, required: true, default: 'Home' }, // Home, Work, Other
  address: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, required: false },
}, {
  timestamps: true
});

export const Address = mongoose.models.Address || mongoose.model<IAddress>('Address', AddressSchema);
