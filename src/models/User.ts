// src/models/User.ts
import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },               // 團主名稱
  email: { type: String, required: true, unique: true },// 登入用 email
  password: { type: String, required: true },           // 雜湊後的密碼
  createdAt: { type: Date, default: Date.now },         // 註冊時間
});

const User = models.User || model('User', userSchema);
export default User;
