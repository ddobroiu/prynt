import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '@/lib/orderStore';
import { prisma } from '@/lib/prisma';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
    }

    let order = null;

    // Check if ID is a number (orderNo) or UUID (id)
    const orderNo = parseInt(id, 10);
    if (Number.isFinite(orderNo) && orderNo > 0) {
      // Search by orderNo in database
      if (process.env.DATABASE_URL) {
        try {
          const dbOrder = await prisma.order.findFirst({ 
            where: { orderNo },
            include: { items: true }
          });
          
          if (dbOrder) {
            order = {
              orderNo: dbOrder.orderNo,
              id: dbOrder.id,
              total: Number(dbOrder.total ?? 0),
              items: (dbOrder.items || []).map((it: any) => ({ 
                name: it.name, 
                qty: it.qty, 
                unit: Number(it.unit), 
                total: Number(it.total)
              }))
            };
          }
        } catch (e) {
          console.error('[API] Error fetching order by orderNo:', e);
        }
      }
    } else {
      // Search by UUID
      const fullOrder = await getOrder(id);
      if (fullOrder) {
        order = {
          orderNo: fullOrder.orderNo,
          id: fullOrder.id,
          total: fullOrder.total,
          items: fullOrder.items.map((item) => ({
            name: item.name,
            qty: item.qty,
            unit: item.unit,
            total: item.total
          }))
        };
      }
    }
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Return order data formatted for Google Analytics
    return NextResponse.json({
      id: order.orderNo.toString(),
      total: order.total,
      items: order.items.map((item: any) => ({
        item_id: item.name, // Using name as ID since we don't have a separate product ID
        item_name: item.name,
        price: item.unit,
        quantity: item.qty
      }))
    });
  } catch (error) {
    console.error('[API] Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
