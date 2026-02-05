import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const job = await prisma.job.update({
      where: { id: params.id },
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

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.job.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
