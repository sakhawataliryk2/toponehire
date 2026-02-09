import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

function jsonResponse(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('Employer login: DATABASE_URL is not set');
      return jsonResponse({ error: 'Server configuration error. DATABASE_URL is missing.' }, 500);
    }

    const { prisma } = await import('../../../../lib/prisma');

    const body = await request.json();
    const email = body?.email;
    const password = body?.password;

    if (!email || !password) {
      return jsonResponse({ error: 'Email and password are required' }, 400);
    }

    const employer = await prisma.employer.findUnique({
      where: { email },
    });

    if (!employer) {
      return jsonResponse({ error: 'Invalid credentials' }, 401);
    }

    const isValidPassword = await bcrypt.compare(password, employer.password);

    if (!isValidPassword) {
      return jsonResponse({ error: 'Invalid credentials' }, 401);
    }

    const { password: _, ...employerWithoutPassword } = employer;

    return jsonResponse({
      success: true,
      user: employerWithoutPassword,
      userType: 'employer',
    }, 200);
  } catch (error) {
    console.error('Employer login error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse(
      {
        error: 'An error occurred during login',
        ...(process.env.NODE_ENV === 'development' && { details: message }),
      },
      500
    );
  }
}
