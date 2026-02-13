import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // EMPLOYER | JOB_SEEKER

    const where: { type?: 'EMPLOYER' | 'JOB_SEEKER'; active?: boolean } = {
      active: true, // Only return active products
    };

    if (type === 'EMPLOYER' || type === 'JOB_SEEKER') {
      where.type = type;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const serialized = products.map((p) => ({
      ...p,
      price: Number(p.price),
    }));

    return NextResponse.json({ products: serialized });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
