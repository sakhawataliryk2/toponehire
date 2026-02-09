import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
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

    const resume = await prisma.resume.update({
      where: { id },
      data: {
        resumeFileUrl: resumeFileUrl !== undefined ? resumeFileUrl : undefined,
        desiredJobTitle: desiredJobTitle || undefined,
        jobType: jobType || undefined,
        categories: categories || undefined,
        personalSummary: personalSummary || undefined,
        location: location || undefined,
        phone: phone || undefined,
        letEmployersFind: letEmployersFind !== undefined ? letEmployersFind : undefined,
        workExperience: workExperience ? JSON.stringify(workExperience) : undefined,
        education: education ? JSON.stringify(education) : undefined,
      },
    });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
