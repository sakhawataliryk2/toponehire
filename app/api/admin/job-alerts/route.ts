import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const frequency = searchParams.get('frequency') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { keywords: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status;
    }
    if (frequency) {
      where.frequency = frequency;
    }

    const orderBy = { [sortBy]: sortOrder as 'asc' | 'desc' };

    const alerts = await prisma.jobAlert.findMany({
      where,
      orderBy,
    });

    const serialized = alerts.map((a) => ({
      id: a.id,
      email: a.email,
      keywords: a.keywords ?? '',
      location: a.location ?? '',
      frequency: a.frequency,
      lastSentAt: a.lastSentAt?.toISOString() ?? null,
      status: a.status,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    }));

    return NextResponse.json({ jobAlerts: serialized, count: serialized.length });
  } catch (error) {
    console.error('Error fetching job alerts:', error);
    return NextResponse.json({ error: 'Failed to fetch job alerts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, keywords, location, frequency, status } = body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const alert = await prisma.jobAlert.create({
      data: {
        email: email.trim(),
        keywords: keywords?.trim() || null,
        location: location?.trim() || null,
        frequency: frequency === 'Weekly' || frequency === 'Monthly' ? frequency : 'Daily',
        status: status === 'Inactive' ? 'Inactive' : 'Active',
      },
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
    console.error('Error creating job alert:', error);
    return NextResponse.json({ error: 'Failed to create job alert' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    const ids = idsParam ? idsParam.split(',').map((id) => id.trim()).filter(Boolean) : [];

    if (ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    await prisma.jobAlert.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ deleted: ids.length });
  } catch (error) {
    console.error('Error deleting job alerts:', error);
    return NextResponse.json({ error: 'Failed to delete job alerts' }, { status: 500 });
  }
}
