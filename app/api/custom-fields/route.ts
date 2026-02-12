import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Public endpoint - no auth required
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get('context'); // EMPLOYER, JOB_SEEKER, RESUME, APPLICATION

    if (!context || !['EMPLOYER', 'JOB_SEEKER', 'RESUME', 'APPLICATION', 'JOB'].includes(context)) {
      return NextResponse.json({ error: 'Invalid context' }, { status: 400 });
    }

    const fields = await prisma.customField.findMany({
      where: {
        context,
        hidden: false, // Only return visible fields
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ fields });
  } catch (error) {
    console.error('Error fetching custom fields:', error);
    return NextResponse.json({ error: 'Failed to fetch custom fields' }, { status: 500 });
  }
}
