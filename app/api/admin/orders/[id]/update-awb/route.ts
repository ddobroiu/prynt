import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/adminSession";

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  const token = request.cookies.get("admin_auth")?.value;
  const session = verifyAdminSession(token);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const orderId = context.params.id;
  let body: any = {};
  try {
    body = await request.json();
  } catch {}
  const awbNumber = body?.awbNumber;
  const awbCarrier = body?.awbCarrier || "DPD";
  if (!awbNumber) {
    return new Response("AWB number required", { status: 400 });
  }
  const result = await prisma.order.update({
    where: { id: orderId },
    data: { awbNumber, awbCarrier },
  }).catch(() => null);
  if (!result) return new Response("Eroare la actualizare AWB", { status: 500 });
  return new Response(JSON.stringify({ id: result.id, awbNumber: result.awbNumber, awbCarrier: result.awbCarrier }), { status: 200 });
}
