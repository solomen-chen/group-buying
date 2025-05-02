// src/app/api/group/delete/[id]/route.ts
import { NextRequest,NextResponse } from "next/server";
import GroupOrder from "@/models/GroupOrder";
import "@/lib/mongodb"; // 確保 mongoose 初始化
type Params = {
  [key: string]: string;
};

export async function DELETE(_request: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params as { id: string };
try {
    await GroupOrder.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("刪除失敗:", error);
    return NextResponse.json({ success: false, error: "刪除失敗" }, { status: 500 });
  }
}
