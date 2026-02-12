import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const jobType = await prisma.jobType.findUnique({ where: { id } });
    if (!jobType) return NextResponse.json({ error: 'Job type not found' }, { status: 404 });
    return NextResponse.json({ jobType });
  } catch (error) {
    console.error('Error fetching job type:', error);
    return NextResponse.json({ error: 'Failed to fetch job type' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, caption, required, hidden, displayAs, maxChoices, order } = body;

    const jobType = await prisma.jobType.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description: description || null }),
        ...(caption !== undefined && { caption }),
        ...(required !== undefined && { required: Boolean(required) }),
        ...(hidden !== undefined && { hidden: Boolean(hidden) }),
        ...(displayAs !== undefined && { displayAs }),
        ...(maxChoices !== undefined && { maxChoices: parseInt(String(maxChoices), 10) }),
        ...(order !== undefined && { order: parseInt(String(order), 10) }),
      },
    });
    return NextResponse.json({ jobType });
  } catch (error: any) {
    console.error('Error updating job type:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Job type name or slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update job type' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.jobType.delete({ where: { id } });
    return NextResponse.json({ message: 'Job type deleted' });
  } catch (error) {
    console.error('Error deleting job type:', error);
    return NextResponse.json({ error: 'Failed to delete job type' }, { status: 500 });
  }
}
