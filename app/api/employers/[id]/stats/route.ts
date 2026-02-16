import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'Last 30 days';

    // Fetch employer
    const employer = await prisma.employer.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        companyName: true,
      },
    });

    if (!employer) {
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    // Calculate date filter based on time range
    let dateFilter = {};
    const now = new Date();
    
    switch (timeRange) {
      case 'Last 7 days':
        dateFilter = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'Last 30 days':
        dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case 'Last 90 days':
        dateFilter = { gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
        break;
      case 'Last year':
        dateFilter = { gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
        break;
      case 'All time':
        dateFilter = {};
        break;
      default:
        dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
    }

    // Build where clause to find jobs by this employer
    const jobWhere = {
      OR: [
        { employer: { equals: employer.companyName, mode: 'insensitive' } },
        { employer: { equals: employer.email, mode: 'insensitive' } },
      ],
      ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
    };

    // Get employer's jobs with statistics
    const jobs = await prisma.job.findMany({
      where: jobWhere as any,
      select: {
        id: true,
        title: true,
        views: true,
        applications: true,
        status: true,
        createdAt: true,
      },
    });

    // Calculate statistics
    const stats = {
      jobsPosted: jobs.length,
      totalViews: jobs.reduce((sum, job) => sum + (job.views || 0), 0),
      totalApplications: jobs.reduce((sum, job) => sum + (job.applications || 0), 0),
      activeJobs: jobs.filter(job => job.status === 'Active').length,
      inactiveJobs: jobs.filter(job => job.status !== 'Active').length,
    };

    // Calculate apply rate (applications / views)
    const applyRate = stats.totalViews > 0 
      ? ((stats.totalApplications / stats.totalViews) * 100).toFixed(2)
      : '0.00';

    // Apply clicks would be same as applications for now (could be tracked separately)
    const applyClicks = stats.totalApplications;

    return NextResponse.json({
      stats: {
        jobsPosted: stats.jobsPosted,
        jobViews: stats.totalViews,
        applications: stats.totalApplications,
        applyClicks: applyClicks,
        applyRate: `${applyRate}%`,
        activeJobs: stats.activeJobs,
        inactiveJobs: stats.inactiveJobs,
      },
      jobs: jobs.map(job => ({
        id: job.id,
        title: job.title,
        views: job.views || 0,
        applications: job.applications || 0,
        status: job.status,
        createdAt: job.createdAt.toISOString(),
      })),
      employer: {
        id: employer.id,
        email: employer.email,
        companyName: employer.companyName,
      },
    });
  } catch (error) {
    console.error('Error fetching employer stats:', error);
    return NextResponse.json({ error: 'Failed to fetch employer stats' }, { status: 500 });
  }
}