import mongoose, { Schema, Document } from 'mongoose';

// Customer Schema
export interface ICustomer extends Document {
  name: string;
  customerType: 'milkman' | 'regular';
  dailyAmount: number; // fixed daily amount in liters
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: true, trim: true, unique: true },
  customerType: { type: String, enum: ['milkman', 'regular'], required: true },
  dailyAmount: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

// Milk Record Schema
export interface IMilkRecord extends Document {
  customerId: mongoose.Types.ObjectId;
  date: Date;
  morningAmount?: number; // morning delivery amount
  eveningAmount?: number; // evening delivery amount
  createdAt: Date;
  updatedAt: Date;
}

const milkRecordSchema = new Schema<IMilkRecord>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: Date, required: true },
  morningAmount: { type: Number, min: 0 },
  eveningAmount: { type: Number, min: 0 },
}, {
  timestamps: true
});

// Create models
export const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', customerSchema);
export const MilkRecord = mongoose.models.MilkRecord || mongoose.model<IMilkRecord>('MilkRecord', milkRecordSchema);
