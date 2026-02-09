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

    // Validate required fields
    if (!jobSeekerId || !desiredJobTitle || !jobType || !categories || !personalSummary || !location || !phone) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missing: {
            jobSeekerId: !jobSeekerId,
            desiredJobTitle: !desiredJobTitle,
            jobType: !jobType,
            categories: !categories,
            personalSummary: !personalSummary,
            location: !location,
            phone: !phone,
          }
        },
        { status: 400 }
      );
    }

    // Prepare resume data - file upload is optional
    const resumeData: any = {
      jobSeekerId,
      resumeFileUrl: resumeFileUrl && resumeFileUrl.trim() !== '' ? resumeFileUrl : null,
      desiredJobTitle,
      jobType,
      categories,
      personalSummary,
      location,
      phone,
      letEmployersFind: letEmployersFind !== undefined ? letEmployersFind : true,
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
