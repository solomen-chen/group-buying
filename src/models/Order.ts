// models/Order.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  groupOrderId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  pickupTime: string;
  pickupLocation: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    groupOrderId: { type: Schema.Types.ObjectId, ref: 'GroupOrder', required: true },
    items: { type: [OrderItemSchema], required: true },
    pickupTime: { type: String, required: true },
    pickupLocation: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
