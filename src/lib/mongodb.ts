// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('請設定 MONGODB_URI 環境變數');
}

// 定義類型
interface MongooseGlobal {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// global 宣告
const globalWithMongoose = globalThis as unknown as MongooseGlobal;

// 初始化 cache
const cached = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'groupbuy',
    }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  globalWithMongoose.mongoose = cached;
  return cached.conn;
}
