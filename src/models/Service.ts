import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  icon?: string;
  image?: string;
  popular?: boolean;
}

const ServiceSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: false },
  image: { type: String, required: false },
  popular: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
