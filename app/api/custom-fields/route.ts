import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

const VALID_CONTEXTS = ['EMPLOYER', 'JOB_SEEKER', 'RESUME', 'APPLICATION', 'JOB'] as const;

// Public endpoint - no auth required
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contextParam = searchParams.get('context');

    if (!contextParam || !VALID_CONTEXTS.includes(contextParam as (typeof VALID_CONTEXTS)[number])) {
      return NextResponse.json({ error: 'Invalid context' }, { status: 400 });
    }

    const fields = await prisma.customField.findMany({
      where: {
        context: contextParam as 'EMPLOYER' | 'JOB_SEEKER' | 'RESUME' | 'APPLICATION' | 'JOB',
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
