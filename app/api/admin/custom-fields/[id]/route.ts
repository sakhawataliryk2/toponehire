import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const field = await prisma.customField.findUnique({ where: { id } });
    if (!field) return NextResponse.json({ error: 'Field not found' }, { status: 404 });
    return NextResponse.json({ field });
  } catch (error) {
    console.error('Error fetching custom field:', error);
    return NextResponse.json({ error: 'Failed to fetch field' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { caption, type, required, hidden, order, options, placeholder, helpText, validation } = body;

    const field = await prisma.customField.update({
      where: { id },
      data: {
        ...(caption !== undefined && { caption }),
        ...(type !== undefined && { type }),
        ...(required !== undefined && { required: Boolean(required) }),
        ...(hidden !== undefined && { hidden: Boolean(hidden) }),
        ...(order !== undefined && { order: parseInt(String(order), 10) }),
        ...(options !== undefined && { options: options ? String(options) : null }),
        ...(placeholder !== undefined && { placeholder: placeholder || null }),
        ...(helpText !== undefined && { helpText: helpText || null }),
        ...(validation !== undefined && { validation: validation ? String(validation) : null }),
      },
    });
    return NextResponse.json({ field });
  } catch (error) {
    console.error('Error updating custom field:', error);
    return NextResponse.json({ error: 'Failed to update field' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.customField.delete({ where: { id } });
    return NextResponse.json({ message: 'Field deleted' });
  } catch (error) {
    console.error('Error deleting custom field:', error);
    return NextResponse.json({ error: 'Failed to delete field' }, { status: 500 });
  }
}
