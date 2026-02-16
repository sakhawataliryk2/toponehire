import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const alert = await prisma.jobAlert.findUnique({
      where: { id },
    });

    if (!alert) {
      return NextResponse.json({ error: 'Job alert not found' }, { status: 404 });
    }

    return NextResponse.json({
      jobAlert: {
        ...alert,
        lastSentAt: alert.lastSentAt?.toISOString() ?? null,
        createdAt: alert.createdAt.toISOString(),
        updatedAt: alert.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching job alert:', error);
    return NextResponse.json({ error: 'Failed to fetch job alert' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, frequency, keywords, location } = body;

    const updateData: Record<string, unknown> = {};
    if (status === 'Active' || status === 'Inactive') updateData.status = status;
    if (frequency === 'Daily' || frequency === 'Weekly' || frequency === 'Monthly') updateData.frequency = frequency;
    if (keywords !== undefined) updateData.keywords = keywords?.trim() || null;
    if (location !== undefined) updateData.location = location?.trim() || null;

    const alert = await prisma.jobAlert.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      jobAlert: {
        ...alert,
        lastSentAt: alert.lastSentAt?.toISOString() ?? null,
        createdAt: alert.createdAt.toISOString(),
        updatedAt: alert.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating job alert:', error);
    return NextResponse.json({ error: 'Failed to update job alert' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.jobAlert.delete({
      where: { id },
    });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Error deleting job alert:', error);
    return NextResponse.json({ error: 'Failed to delete job alert' }, { status: 500 });
  }
}
