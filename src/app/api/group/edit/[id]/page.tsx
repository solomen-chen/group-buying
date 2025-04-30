// src/app/api/group/edit/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import GroupOrder from "@/models/GroupOrder";
import "@/lib/mongodb"; // 確保 mongoose 連線

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { groupname, deadline } = await req.json();

  await GroupOrder.updateOne(
    { _id: id },
    { groupname, deadline }
  );

  return NextResponse.json({ message: "更新成功" });
}
