import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      location,
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, firstName, lastName' },
        { status: 400 }
      );
    }

    // Check if job seeker already exists
    const existingJobSeeker = await prisma.jobSeeker.findUnique({
      where: { email },
    });

    if (existingJobSeeker) {
      return NextResponse.json(
        { error: 'A job seeker with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create job seeker
    const jobSeeker = await prisma.jobSeeker.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        location: location || null,
      },
    });

    // Return job seeker without password
    const { password: _, ...jobSeekerWithoutPassword } = jobSeeker;

    return NextResponse.json(
      { success: true, jobSeeker: jobSeekerWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating job seeker:', error);
    return NextResponse.json(
      { error: 'Failed to create job seeker account', details: error?.message },
      { status: 500 }
    );
  }
}
