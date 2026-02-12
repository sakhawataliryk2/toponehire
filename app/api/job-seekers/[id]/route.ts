import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const jobSeeker = await prisma.jobSeeker.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!jobSeeker) {
      return NextResponse.json({ error: 'Job seeker not found' }, { status: 404 });
    }

    return NextResponse.json({ jobSeeker });
  } catch (error) {
    console.error('Error fetching job seeker:', error);
    return NextResponse.json({ error: 'Failed to fetch job seeker' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, phone, location } = body;

    const jobSeeker = await prisma.jobSeeker.update({
      where: { id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        location: location || undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ jobSeeker });
  } catch (error) {
    console.error('Error updating job seeker:', error);
    return NextResponse.json({ error: 'Failed to update job seeker' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.jobSeeker.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Job seeker deleted successfully' });
  } catch (error) {
    console.error('Error deleting job seeker:', error);
    return NextResponse.json({ error: 'Failed to delete job seeker' }, { status: 500 });
  }
}
