// src/lib/models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  group: mongoose.Types.ObjectId;
  name: string;
  imageUrl: string;
  spec: string;
  price: number;
  supply: number; // 0 = 不限量
  createdAt: Date;
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    spec: { type: String, required: true },
    price: { type: Number, required: true },
    supply: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
