import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let where: any = {};

    if (search) {
      where = {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
          { companyName: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const employers = await prisma.employer.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ employers });
  } catch (error) {
    console.error('Error fetching employers:', error);
    return NextResponse.json({ error: 'Failed to fetch employers' }, { status: 500 });
  }
}
