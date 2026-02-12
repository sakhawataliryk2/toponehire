import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Fetch custom fields configuration for JOB_SEEKER context
    const customFields = await prisma.customField.findMany({
      where: {
        context: 'JOB_SEEKER',
        hidden: false,
      },
      orderBy: { order: 'asc' },
    });

    // Validate required custom fields
    const missingFields: string[] = [];
    const fieldValues: Record<string, any> = {};

    // Extract values from form data (could be customField_<id> or standard field names)
    for (const field of customFields) {
      if (field.required) {
        const fieldKey = `customField_${field.id}`;
        const value = body[fieldKey] || body[field.caption.toLowerCase().replace(/\s+/g, '')];
        
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(field.caption);
        } else {
          fieldValues[fieldKey] = value;
        }
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Extract standard fields from custom field values (map by caption)
    let email = '';
    let password = '';
    let firstName = '';
    let lastName = '';
    let phone: string | null = null;
    let location: string | null = null;

    for (const field of customFields) {
      const fieldKey = `customField_${field.id}`;
      const value = body[fieldKey] || body[field.caption.toLowerCase().replace(/\s+/g, '')];
      const captionLower = field.caption.toLowerCase();

      if (captionLower.includes('email')) email = String(value || '');
      else if (captionLower.includes('password')) password = String(value || '');
      else if (captionLower.includes('first name') || (captionLower.includes('firstname') && !captionLower.includes('last'))) firstName = String(value || '');
      else if (captionLower.includes('last name') || captionLower.includes('lastname')) lastName = String(value || '');
      else if (captionLower.includes('phone')) phone = value ? String(value) : null;
      else if (captionLower.includes('location')) location = value ? String(value) : null;
    }

    // Also check direct field names in body (for backward compatibility)
    email = email || body.email || '';
    password = password || body.password || '';
    firstName = firstName || body.firstName || '';
    lastName = lastName || body.lastName || '';
    phone = phone || body.phone || null;
    location = location || body.location || null;

    // Email and password are always required for authentication
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required for account creation' },
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

    // Create job seeker with extracted values (use defaults if not provided)
    const jobSeeker = await prisma.jobSeeker.create({
      data: {
        email,
        password: hashedPassword,
        firstName: firstName || 'N/A',
        lastName: lastName || 'N/A',
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
