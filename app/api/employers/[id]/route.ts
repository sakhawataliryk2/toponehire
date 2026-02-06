import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const employer = await prisma.employer.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        location: true,
        companyName: true,
        website: true,
        logoUrl: true,
        companyDescription: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    return NextResponse.json({ employer });
  } catch (error) {
    console.error('Error fetching employer:', error);
    return NextResponse.json({ error: 'Failed to fetch employer' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { companyName, website, location, phone, companyDescription } = body;

    const employer = await prisma.employer.update({
      where: { id },
      data: {
        companyName: companyName || undefined,
        website: website || undefined,
        location: location || undefined,
        phone: phone || undefined,
        companyDescription: companyDescription || undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        location: true,
        companyName: true,
        website: true,
        logoUrl: true,
        companyDescription: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ employer });
  } catch (error) {
    console.error('Error updating employer:', error);
    return NextResponse.json({ error: 'Failed to update employer' }, { status: 500 });
  }
}
