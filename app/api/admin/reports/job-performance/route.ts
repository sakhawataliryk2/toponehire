import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const timeRange = searchParams.get('timeRange') || 'Last 30 days';
    const status = searchParams.get('status') || 'all';
    
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

    // Build where clause for jobs
    const jobWhere: any = {};
    
    // Add date filter
    if (Object.keys(dateFilter).length > 0) {
      jobWhere.createdAt = dateFilter;
    }
    
    // Add search filter
    if (search) {
      jobWhere.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { employer: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { categories: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Add status filter
    if (status !== 'all') {
      jobWhere.status = status;
    }

    // Get jobs with performance data
    const jobs = await prisma.job.findMany({
      where: jobWhere,
      select: {
        id: true,
        title: true,
        employer: true,
        location: true,
        categories: true,
        jobType: true,
        salaryFrom: true,
        salaryTo: true,
        salaryFrequency: true,
        views: true,
        applications: true,
        status: true,
        featured: true,
        createdAt: true,
        expirationDate: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform jobs data
    const jobsPerformance = jobs.map(job => {
      const applyRate = (job.views || 0) > 0 
        ? (((job.applications || 0) / job.views) * 100).toFixed(2)
        : '0.00';

      const salaryRange = job.salaryFrom && job.salaryTo
        ? `$${job.salaryFrom} - $${job.salaryTo} ${job.salaryFrequency || 'yearly'}`
        : '-';

      const daysActive = Math.floor((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24));

      return {
        id: job.id,
        title: job.title,
        employer: job.employer,
        location: job.location,
        categories: job.categories,
        jobType: job.jobType,
        salaryRange,
        views: job.views || 0,
        applications: job.applications || 0,
        applyClicks: job.applications || 0, // Same as applications for now
        applyRate: `${applyRate}%`,
        status: job.status,
        featured: job.featured,
        daysActive,
        postingDate: job.createdAt.toISOString().split('T')[0],
        expirationDate: job.expirationDate ? job.expirationDate.toISOString().split('T')[0] : null,
      };
    });

    // Calculate totals
    const totals = {
      totalJobs: jobsPerformance.length,
      totalViews: jobsPerformance.reduce((sum, job) => sum + job.views, 0),
      totalApplications: jobsPerformance.reduce((sum, job) => sum + job.applications, 0),
      totalApplyClicks: jobsPerformance.reduce((sum, job) => sum + job.applyClicks, 0),
      activeJobs: jobsPerformance.filter(job => job.status === 'Active').length,
      featuredJobs: jobsPerformance.filter(job => job.featured).length,
    };

    const overallApplyRate = totals.totalViews > 0 
      ? ((totals.totalApplications / totals.totalViews) * 100).toFixed(2)
      : '0.00';

    return NextResponse.json({
      jobs: jobsPerformance,
      totals: {
        ...totals,
        overallApplyRate: `${overallApplyRate}%`,
      },
      recordsFound: jobsPerformance.length,
    });
  } catch (error) {
    console.error('Error fetching job performance:', error);
    return NextResponse.json({ error: 'Failed to fetch job performance data' }, { status: 500 });
  }
}