// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // 1. Verify Admin Session
  const token = req.cookies.get("admin_auth")?.value;
  const session = verifyAdminSession(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const status = searchParams.get("status");
  const query = searchParams.get("query");

  const skip = (page - 1) * limit;

  // 2. Build Prisma Query
  const orConditions = [];
  if (query) {
    if (!isNaN(parseInt(query))) {
      orConditions.push({ orderNo: parseInt(query) });
    }
    orConditions.push({ address: { path: ["nume_prenume"], string_contains: query, mode: 'insensitive' } });
    orConditions.push({ address: { path: ["email"], string_contains: query, mode: 'insensitive' } });
    orConditions.push({ billing: { path: ["name"], string_contains: query, mode: 'insensitive' } });
    orConditions.push({ billing: { path: ["cui"], string_contains: query, mode: 'insensitive' } });
  }

  let where: any = {};
  if (status) {
    where.status = status;
  }

  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  try {
    // 3. Fetch Data and Count
    const [orders, totalOrders] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip,
        include: { items: true },
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    // 4. Return Response
    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        limit,
      },
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
