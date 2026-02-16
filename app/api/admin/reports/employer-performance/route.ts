import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const timeRange = searchParams.get('timeRange') || 'Last 30 days';
    
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

    // Get all employers with search filter
    const employerWhere: any = {};
    if (search) {
      employerWhere.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const employers = await prisma.employer.findMany({
      where: employerWhere,
      select: {
        id: true,
        email: true,
        companyName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get performance data for each employer
    const employerPerformance = await Promise.all(
      employers.map(async (employer) => {
        const jobWhere = {
          OR: [
            { employer: { equals: employer.companyName, mode: 'insensitive' } },
            { employer: { equals: employer.email, mode: 'insensitive' } },
          ],
          ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
        };

        const jobs = await prisma.job.findMany({
          where: jobWhere as any,
          select: {
            id: true,
            views: true,
            applications: true,
            status: true,
          },
        });

        const stats = {
          jobsPosted: jobs.length,
          totalViews: jobs.reduce((sum, job) => sum + (job.views || 0), 0),
          totalApplications: jobs.reduce((sum, job) => sum + (job.applications || 0), 0),
          activeJobs: jobs.filter(job => job.status === 'Active').length,
        };

        const applyRate = stats.totalViews > 0 
          ? ((stats.totalApplications / stats.totalViews) * 100).toFixed(2)
          : '0.00';

        return {
          id: employer.id,
          employer: employer.companyName || employer.email,
          email: employer.email,
          jobsPosted: stats.jobsPosted,
          jobViews: stats.totalViews,
          applications: stats.totalApplications,
          applyClicks: stats.totalApplications, // Same as applications for now
          applyRate: `${applyRate}%`,
          activeJobs: stats.activeJobs,
          joinedDate: employer.createdAt.toISOString().split('T')[0],
        };
      })
    );

    // Filter out employers with no activity if search is applied
    const filteredPerformance = search 
      ? employerPerformance 
      : employerPerformance;

    // Calculate totals
    const totals = {
      totalEmployers: filteredPerformance.length,
      totalJobsPosted: filteredPerformance.reduce((sum, emp) => sum + emp.jobsPosted, 0),
      totalViews: filteredPerformance.reduce((sum, emp) => sum + emp.jobViews, 0),
      totalApplications: filteredPerformance.reduce((sum, emp) => sum + emp.applications, 0),
      totalApplyClicks: filteredPerformance.reduce((sum, emp) => sum + emp.applyClicks, 0),
    };

    const overallApplyRate = totals.totalViews > 0 
      ? ((totals.totalApplications / totals.totalViews) * 100).toFixed(2)
      : '0.00';

    return NextResponse.json({
      employers: filteredPerformance,
      totals: {
        ...totals,
        overallApplyRate: `${overallApplyRate}%`,
      },
      recordsFound: filteredPerformance.length,
    });
  } catch (error) {
    console.error('Error fetching employer performance:', error);
    return NextResponse.json({ error: 'Failed to fetch employer performance data' }, { status: 500 });
  }
}