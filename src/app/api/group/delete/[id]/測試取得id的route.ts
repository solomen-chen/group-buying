// src/app/api/group/delete/[id]/route.ts
// import { NextRequest,NextResponse } from "next/server";
// import GroupOrder from "@/models/GroupOrder";
// import "@/lib/mongodb"; // 確保 mongoose 初始化
// // Removed getDynamicParam as it is not exported

// export async function DELETE(request: NextRequest) {
//   // Use params from the request object to get the dynamic id
//   const pathname = new URL(request.url).pathname;
//   const id = pathname.split("/").pop(); // /api/group/delete/<id>

//   try {
//     await GroupOrder.deleteOne({ _id: id });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("刪除失敗:", error);
//     return NextResponse.json({ success: false, error: "刪除失敗" }, { status: 500 });
//   }
// }
// app/api/group/delete/[id]/route.js

// app/api/group/delete/[id]/route.js

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  console.log("收到刪除請求，groupId:", id);

  return new Response(`收到刪除請求，groupId: ${id}`, {
    status: 200,
  });
}



