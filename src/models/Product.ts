// models/Product.ts
import mongoose, { Schema, Document } from 'mongoose';



export interface IProduct extends Document {
  groupOrderId: mongoose.Types.ObjectId;
  name: string;
  imageUrl: string;
  spec: string;
  price: number;
  supply: number; // 0 表示無上限
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    groupOrderId: { type: Schema.Types.ObjectId, ref: 'GroupOrder', required: true },
    name: { type: String, required: true },
    imageUrl: { type: String },
    spec: { type: String },
    price: { type: Number},
    supply: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
