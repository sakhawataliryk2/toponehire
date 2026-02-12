import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobSeekerId = searchParams.get('jobSeekerId');

    if (!jobSeekerId) {
      return NextResponse.json({ error: 'jobSeekerId is required' }, { status: 400 });
    }

    const resumes = await prisma.resume.findMany({
      where: { jobSeekerId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ resumes });
  } catch (error: any) {
    console.error('Error fetching resumes:', error);
    
    // Check if it's a table doesn't exist error
    if (error?.message?.includes('does not exist') || error?.code === 'P2021' || error?.code === '42P01') {
      return NextResponse.json(
        { 
          error: 'Resumes table does not exist. Please run the database migration.',
          details: 'Run the SQL migration from prisma/migrations/20260209205150_add_resume_table/migration.sql in your Supabase SQL Editor',
          code: error?.code
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch resumes',
        details: error?.message || 'Unknown error',
        code: error?.code
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Fetch custom fields configuration for RESUME context
    const customFields = await prisma.customField.findMany({
      where: {
        context: 'RESUME',
        hidden: false,
      },
      orderBy: { order: 'asc' },
    });

    // Validate required custom fields
    const missingFields: string[] = [];

    // Extract values from form data (could be customField_<id> or standard field names)
    for (const field of customFields) {
      if (field.required) {
        const fieldKey = `customField_${field.id}`;
        const value = body[fieldKey] || body[field.caption.toLowerCase().replace(/\s+/g, '')];
        
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          missingFields.push(field.caption);
        }
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const {
      jobSeekerId,
      resumeFileUrl,
      desiredJobTitle,
      jobType,
      categories,
      personalSummary,
      location,
      phone,
      letEmployersFind,
      workExperience,
      education,
    } = body;

    // jobSeekerId is always required
    if (!jobSeekerId) {
      return NextResponse.json(
        { error: 'Job seeker ID is required' },
        { status: 400 }
      );
    }

    // Extract standard fields from custom field values (map by caption)
    let extractedDesiredJobTitle = '';
    let extractedJobType = '';
    let extractedCategories = '';
    let extractedPersonalSummary = '';
    let extractedLocation = '';
    let extractedPhone = '';
    let extractedLetEmployersFind = true;

    for (const field of customFields) {
      const fieldKey = `customField_${field.id}`;
      const value = body[fieldKey] || body[field.caption.toLowerCase().replace(/\s+/g, '')];
      const captionLower = field.caption.toLowerCase();

      if (captionLower.includes('desired') && captionLower.includes('job') && captionLower.includes('title')) extractedDesiredJobTitle = String(value || '');
      else if (captionLower.includes('job') && captionLower.includes('type')) extractedJobType = String(value || '');
      else if (captionLower.includes('categor')) extractedCategories = String(value || '');
      else if (captionLower.includes('personal') && captionLower.includes('summary')) extractedPersonalSummary = String(value || '');
      else if (captionLower.includes('location')) extractedLocation = String(value || '');
      else if (captionLower.includes('phone')) extractedPhone = String(value || '');
      else if (captionLower.includes('employer') && captionLower.includes('find')) extractedLetEmployersFind = Boolean(value);
    }

    // Use extracted values or fall back to direct body values
    const finalDesiredJobTitle = extractedDesiredJobTitle || desiredJobTitle || '';
    const finalJobType = extractedJobType || jobType || '';
    const finalCategories = extractedCategories || categories || '';
    const finalPersonalSummary = extractedPersonalSummary || personalSummary || '';
    const finalLocation = extractedLocation || location || '';
    const finalPhone = extractedPhone || phone || '';
    const finalLetEmployersFind = letEmployersFind !== undefined ? letEmployersFind : extractedLetEmployersFind;

    // Prepare resume data - file upload is optional
    const resumeData: any = {
      jobSeekerId,
      resumeFileUrl: resumeFileUrl && resumeFileUrl.trim() !== '' ? resumeFileUrl : null,
      desiredJobTitle: finalDesiredJobTitle,
      jobType: finalJobType,
      categories: finalCategories,
      personalSummary: finalPersonalSummary,
      location: finalLocation,
      phone: finalPhone,
      letEmployersFind: finalLetEmployersFind,
      workExperience: workExperience && Array.isArray(workExperience) && workExperience.length > 0 
        ? JSON.stringify(workExperience) 
        : null,
      education: education && Array.isArray(education) && education.length > 0
        ? JSON.stringify(education)
        : null,
    };

    // Add optional fields if schema supports them
    try {
      resumeData.status = 'Active';
      resumeData.views = 0;
    } catch (e) {
      // Schema might not have these fields yet, that's okay
    }

    console.log('Creating resume with data:', { ...resumeData, workExperience: '...', education: '...' });

    const resume = await prisma.resume.create({
      data: resumeData,
    });

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating resume:', error);
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    // Check if it's a table doesn't exist error
    if (
      error?.message?.includes('does not exist') || 
      error?.code === 'P2021' || 
      error?.code === '42P01' ||
      error?.message?.includes('relation') ||
      error?.message?.includes('table')
    ) {
      return NextResponse.json(
        { 
          error: 'Resumes table does not exist. Please run the database migration.',
          details: 'Copy the SQL from CREATE_RESUMES_TABLE.sql and run it in Supabase SQL Editor',
          code: error?.code,
          message: error?.message
        },
        { status: 500 }
      );
    }
    
    // Check for Prisma validation errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { 
          error: 'A resume with this information already exists',
          details: error?.message,
          code: error?.code
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create resume', 
        details: error?.message || 'Unknown error', 
        code: error?.code,
        meta: error?.meta
      },
      { status: 500 }
    );
  }
}
