import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  userId: string;       // Clerk User ID
  customerName: string;
  customerEmail: string;
  orderId: string;      // Human readable ID like #ED-1234
  service: string;
  itemsSummary: string;
  totalAmount: number;
  pickupDate: string;
  pickupTime: string;
  address: string;
  phone: string;
  notes?: string;
  paymentMethod?: 'online' | 'cod';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status: 'pickup' | 'processing' | 'delivery' | 'completed';
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  customerName: { type: String, required: false, default: 'Customer' },
  customerEmail: { type: String, required: false, default: 'No email' },
  orderId: { type: String, required: true, unique: true },
  service: { type: String, required: true },
  itemsSummary: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  pickupDate: { type: String, required: true },
  pickupTime: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String, required: false },
  paymentMethod: { type: String, enum: ['online', 'cod'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayPaymentId: { type: String, required: false },
  razorpayOrderId: { type: String, required: false },
  status: { 
    type: String, 
    required: true,
    enum: ['pickup', 'processing', 'delivery', 'completed'],
    default: 'pickup'
  },
  createdAt: { type: Date, default: Date.now },
}, { strict: false });

if (mongoose.models && mongoose.models.Order) {
  delete (mongoose.models as any).Order;
}

export const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);

