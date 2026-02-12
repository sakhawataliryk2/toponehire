import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const jobTypes = await prisma.jobType.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ jobTypes });
  } catch (error) {
    console.error('Error fetching job types:', error);
    return NextResponse.json({ error: 'Failed to fetch job types' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, caption, required, hidden, displayAs, maxChoices, order } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const jobType = await prisma.jobType.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description: description || null,
        caption: caption || 'Job Type',
        required: required !== false,
        hidden: Boolean(hidden),
        displayAs: displayAs || 'Dropdown',
        maxChoices: maxChoices != null ? parseInt(String(maxChoices), 10) : 1,
        order: order != null ? parseInt(String(order), 10) : 0,
      },
    });
    return NextResponse.json({ jobType }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating job type:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Job type name or slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create job type' }, { status: 500 });
  }
}
