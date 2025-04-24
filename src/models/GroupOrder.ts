// src/models/GroupOrder.ts
import { Schema, model, models } from 'mongoose';

const groupOrderSchema = new Schema({
  groupName: { type: String, required: true },
  deadline: { type: Date, required: true },
  pickupOptions: [{ type: String }], // 時間與地點格式的字串陣列
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      name: String,
      image: String,
      spec: String,
      price: String,
      supply: String,
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const GroupOrder = models.GroupOrder || model('GroupOrder', groupOrderSchema);
export default GroupOrder;
