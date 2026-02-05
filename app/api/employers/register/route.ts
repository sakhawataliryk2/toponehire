import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      fullName,
      phone,
      location,
      password,
      companyName,
      website,
      logoUrl,
      companyDescription,
    } = body;

    // Validate required fields
    if (!email || !fullName || !phone || !location || !password || !companyName || !website) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if employer already exists
    const existingEmployer = await prisma.employer.findUnique({
      where: { email },
    });

    if (existingEmployer) {
      return NextResponse.json(
        { error: 'An employer with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create employer
    const employer = await prisma.employer.create({
      data: {
        email,
        fullName,
        phone,
        location,
        password: hashedPassword,
        companyName,
        website,
        logoUrl: logoUrl || null,
        companyDescription: companyDescription || null,
      },
    });

    // Return employer without password
    const { password: _, ...employerWithoutPassword } = employer;

    return NextResponse.json(
      { success: true, employer: employerWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating employer:', error);
    return NextResponse.json(
      { error: 'Failed to create employer account', details: error?.message },
      { status: 500 }
    );
  }
}
