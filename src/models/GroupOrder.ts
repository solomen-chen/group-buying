// models/GroupOrder.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPickupOption {
  time: string;
  location: string;
}

export interface IGroupOrder extends Document {
  groupname: string;
  deadline: Date;
  pickupOptions: IPickupOption[];
  status: 'open' | 'closed';
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PickupOptionSchema = new Schema<IPickupOption>(
  {
    time: { type: String, required: true },
    location: { type: String, required: true },
  },
  { _id: false }
);

const GroupOrderSchema: Schema = new Schema<IGroupOrder>(
  {
    groupname: { type: String, required: true },
    deadline: { type: Date, required: true },
    pickupOptions: { type: [PickupOptionSchema], required: true }, // ✅ 正確定義
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.GroupOrder ||
  mongoose.model<IGroupOrder>('GroupOrder', GroupOrderSchema);
