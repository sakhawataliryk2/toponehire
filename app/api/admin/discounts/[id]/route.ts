import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const discount = await prisma.discount.findUnique({ where: { id } });
    if (!discount) return NextResponse.json({ error: 'Discount not found' }, { status: 404 });
    return NextResponse.json({ discount: { ...discount, value: Number(discount.value) } });
  } catch (error) {
    console.error('Error fetching discount:', error);
    return NextResponse.json({ error: 'Failed to fetch discount' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, type, value, maxUses, usedCount, startDate, expiryDate, status } = body;

    const discount = await prisma.discount.update({
      where: { id },
      data: {
        ...(code !== undefined && { code: String(code).trim().toUpperCase() }),
        ...(type !== undefined && { type: type === 'FIXED' ? 'FIXED' : 'PERCENT' }),
        ...(value !== undefined && { value: Number(value) }),
        ...(maxUses !== undefined && { maxUses: Math.max(0, parseInt(String(maxUses), 10)) }),
        ...(usedCount !== undefined && { usedCount: Math.max(0, parseInt(String(usedCount), 10)) }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(expiryDate !== undefined && { expiryDate: expiryDate ? new Date(expiryDate) : null }),
        ...(status !== undefined && {
          status: status === 'ACTIVE' ? 'ACTIVE' : status === 'EXPIRED' ? 'EXPIRED' : status === 'PENDING_USED' ? 'PENDING_USED' : 'NOT_ACTIVE',
        }),
      },
    });
    return NextResponse.json({ discount: { ...discount, value: Number(discount.value) } });
  } catch (error) {
    console.error('Error updating discount:', error);
    return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.discount.delete({ where: { id } });
    return NextResponse.json({ message: 'Discount deleted' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    return NextResponse.json({ error: 'Failed to delete discount' }, { status: 500 });
  }
}
