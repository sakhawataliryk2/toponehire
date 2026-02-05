import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin with this email or username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...adminWithoutPassword } = admin;

    return NextResponse.json({
      success: true,
      admin: adminWithoutPassword,
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating admin' },
      { status: 500 }
    );
  }
}
