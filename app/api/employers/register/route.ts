import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Fetch custom fields configuration for EMPLOYER context
    const customFields = await prisma.customField.findMany({
      where: {
        context: 'EMPLOYER',
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
    let fullName = '';
    let phone = '';
    let location = '';
    let companyName = '';
    let website = '';
    let logoUrl: string | null = null;
    let companyDescription: string | null = null;

    for (const field of customFields) {
      const fieldKey = `customField_${field.id}`;
      const value = body[fieldKey] || body[field.caption.toLowerCase().replace(/\s+/g, '')];
      const captionLower = field.caption.toLowerCase();

      if (captionLower.includes('email')) email = String(value || '');
      else if (captionLower.includes('password')) password = String(value || '');
      else if (captionLower.includes('full name') || (captionLower.includes('name') && !captionLower.includes('company'))) fullName = String(value || '');
      else if (captionLower.includes('phone')) phone = String(value || '');
      else if (captionLower.includes('location')) location = String(value || '');
      else if (captionLower.includes('company') && captionLower.includes('name')) companyName = String(value || '');
      else if (captionLower.includes('website')) website = String(value || '');
      else if (captionLower.includes('logo')) logoUrl = value ? String(value) : null;
      else if (captionLower.includes('company') && captionLower.includes('description')) companyDescription = value ? String(value) : null;
    }

    // Also check direct field names in body (for backward compatibility)
    email = email || body.email || '';
    password = password || body.password || '';
    fullName = fullName || body.fullName || '';
    phone = phone || body.phone || '';
    location = location || body.location || '';
    companyName = companyName || body.companyName || '';
    website = website || body.website || '';
    logoUrl = logoUrl || body.logoUrl || null;
    companyDescription = companyDescription || body.companyDescription || null;

    // Email and password are always required for authentication
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required for account creation' },
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

    // Create employer with extracted values (use defaults if not provided)
    const employer = await prisma.employer.create({
      data: {
        email,
        password: hashedPassword,
        fullName: fullName || 'N/A',
        phone: phone || 'N/A',
        location: location || 'N/A',
        companyName: companyName || 'N/A',
        website: website || 'N/A',
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
