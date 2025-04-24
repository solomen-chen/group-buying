// src/app/api/group/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import GroupOrder from '@/models/GroupOrder';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  try {
    const { groupName, deadline, pickupOptions, ownerId, products } = await req.json();

    if (!groupName || !deadline || !pickupOptions?.length || !ownerId || !products?.length) {
      return NextResponse.json({ message: '欄位不可為空' }, { status: 400 });
    }

    await connectToDatabase();

    const group = await GroupOrder.create({
      name: groupName,
      deadline,
      pickupOptions, // structured: [{ time, location }]
      status: 'open',
      ownerId,
    });

    for (const p of products) {
      await Product.create({
        group: group._id,
        name: p.name,
        imageUrl: p.image,
        spec: p.spec,
        price: Number(p.price),
        supply: Number(p.supply),
      });
    }

    return NextResponse.json({ message: '團單建立成功', groupId: group._id });
  } catch (error) {
    console.error('建立團單錯誤:', error);
    return NextResponse.json({ message: '伺服器錯誤' }, { status: 500 });
  }
}
