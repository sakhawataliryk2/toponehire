import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const perPage = Math.min(50, Math.max(10, parseInt(searchParams.get('perPage') || '20', 10)));
    const skip = (page - 1) * perPage;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: {
          product: { select: { id: true, name: true, type: true } },
          paymentMethod: { select: { id: true, name: true } },
        },
      }),
      prisma.order.count(),
    ]);

    const serialized = orders.map((o) => ({
      ...o,
      total: Number(o.total),
    }));

    return NextResponse.json({ orders: serialized, total, page, perPage });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
