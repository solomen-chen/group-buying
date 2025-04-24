// src/lib/models/Group.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  deadline: Date;
  owner: mongoose.Types.ObjectId;
  pickups: { time: string; location: string }[];
  createdAt: Date;
}

const GroupSchema: Schema = new Schema<IGroup>(
  {
    name: { type: String, required: true },
    deadline: { type: Date, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pickups: [
      {
        time: { type: String, required: true },
        location: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
