import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find job seeker by email
    const jobSeeker = await prisma.jobSeeker.findUnique({
      where: { email },
    });

    if (!jobSeeker) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, jobSeeker.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return job seeker data (without password)
    const { password: _, ...jobSeekerWithoutPassword } = jobSeeker;

    return NextResponse.json({
      success: true,
      user: jobSeekerWithoutPassword,
      userType: 'job-seeker',
    });
  } catch (error) {
    console.error('Job seeker login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
