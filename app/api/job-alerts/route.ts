import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const keywords = typeof body?.keywords === 'string' ? body.keywords.trim() : null;
    const location = typeof body?.location === 'string' ? body.location.trim() : null;
    const frequency = body?.frequency === 'Weekly' || body?.frequency === 'Monthly' ? body.frequency : 'Daily';

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const alert = await prisma.jobAlert.create({
      data: {
        email,
        keywords: keywords || null,
        location: location || null,
        frequency,
        status: 'Active',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Job alert created. You will receive emails when new jobs match your criteria.',
      id: alert.id,
    });
  } catch (error) {
    console.error('Error creating job alert:', error);
    return NextResponse.json({ error: 'Failed to create job alert' }, { status: 500 });
  }
}
