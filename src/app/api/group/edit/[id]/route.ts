// src/app/api/group/edit/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import GroupOrder from "@/models/GroupOrder";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const groupId = params.id;
    const { groupname, deadline, pickupOptions, products, ownerId } = await req.json();

    if (!groupname || !deadline || !pickupOptions?.length || !ownerId || !products?.length) {
      return NextResponse.json({ message: "欄位不可為空" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return NextResponse.json({ message: "無效的團單 ID" }, { status: 400 });
    }

    await connectToDatabase();

    const existingGroup = await GroupOrder.findOne({ _id: groupId, ownerId });
    if (!existingGroup) {
      return NextResponse.json({ message: "找不到團單或你沒有權限修改" }, { status: 404 });
    }

    // 更新 group 資訊
    existingGroup.groupname = groupname;
    existingGroup.deadline = deadline;
    existingGroup.pickupOptions = pickupOptions;
    await existingGroup.save();

    // 刪除舊商品資料（重建所有商品）
    await Product.deleteMany({ groupOrderId: groupId });

    for (const p of products) {
      await Product.create({
        groupOrderId: groupId,
        name: p.name,
        imageUrl: p.imageUrl,
        spec: p.spec,
        price: Number(p.price),
        supply: Number(p.supply),
      });
    }

    return NextResponse.json({ message: "團單已更新成功" });
  } catch (error) {
    console.error("更新團單錯誤:", error);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}


