import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, isActive, config } = body;
    const paymentMethod = await prisma.paymentMethod.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: String(name).trim() }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(config !== undefined && { config: config != null ? String(config) : null }),
      },
    });
    return NextResponse.json({ paymentMethod });
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json({ error: 'Failed to update payment method' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.paymentMethod.delete({ where: { id } });
    return NextResponse.json({ message: 'Payment method deleted' });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json({ error: 'Failed to delete payment method' }, { status: 500 });
  }
}
