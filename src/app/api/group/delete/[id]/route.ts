import { NextRequest } from "next/server";
type Params = {
  [key: string]: string;
};

export async function DELETE(_request: NextRequest, context: { params: Promise<Params> }) {
  const { id } = await context.params as { id: string };

  console.log("收到刪除請求，groupId:", id);

  return new Response(`收到刪除請求，groupId: ${id}`, {
    status: 200,
  });
}
