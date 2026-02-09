import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { employer: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'Any Status') {
      where.status = status;
    } else {
      // For public jobs page, default to Active jobs
      where.status = 'Active';
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { postingDate: 'desc' },
    });

    return NextResponse.json({ jobs, count: jobs.length });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error?.message || String(error)
      : 'Failed to fetch jobs';
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      employer,
      product,
      jobDescription,
      jobType,
      categories,
      location,
      salaryFrom,
      salaryTo,
      salaryFrequency,
      howToApply,
      applyValue,
      featured,
      status,
      expirationDate,
    } = body;

    // Validate required fields
    if (!title || !employer || !jobDescription || !jobType || !categories) {
      return NextResponse.json(
        { error: 'Missing required fields: title, employer, jobDescription, jobType, categories' },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        title,
        employer,
        product: product || null,
        jobDescription,
        jobType,
        categories,
        location: location || 'Onsite',
        salaryFrom: salaryFrom || null,
        salaryTo: salaryTo || null,
        salaryFrequency: salaryFrequency || 'yearly',
        howToApply: howToApply || 'email',
        applyValue: applyValue || null,
        featured: featured || false,
        status: status || 'Active',
        expirationDate: expirationDate ? new Date(expirationDate) : null,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating job:', error);
    // Return more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error?.message || String(error)
      : 'Failed to create job';
    return NextResponse.json(
      { error: 'Failed to create job', details: errorMessage },
      { status: 500 }
    );
  }
}
