import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Sync jobs to Top One Hire (internal/external API)
async function syncJobToTopOneHire(job: any, apiEndpoint: string, apiKey?: string) {
  const payload = {
    title: job.title,
    employer: job.employer,
    description: job.jobDescription,
    jobType: job.jobType,
    category: job.categories,
    location: job.location,
    salaryFrom: job.salaryFrom,
    salaryTo: job.salaryTo,
    salaryFrequency: job.salaryFrequency,
    howToApply: job.howToApply,
    applyValue: job.applyValue,
    featured: job.featured,
    postingDate: job.postingDate,
    expirationDate: job.expirationDate,
  };

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
    headers['X-API-Key'] = apiKey;
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Top One Hire API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Top One Hire sync error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      apiEndpoint,
      apiKey,
      jobIds, // Optional: specific job IDs to sync, otherwise sync all active
      syncAll = false,
    } = body;

    if (!apiEndpoint) {
      return NextResponse.json(
        { error: 'API endpoint is required' },
        { status: 400 }
      );
    }

    // Fetch jobs to sync
    let jobs;
    if (jobIds && Array.isArray(jobIds) && jobIds.length > 0) {
      jobs = await prisma.job.findMany({
        where: {
          id: { in: jobIds },
          status: 'Active',
        },
      });
    } else if (syncAll) {
      jobs = await prisma.job.findMany({
        where: {
          status: 'Active',
        },
        orderBy: {
          postingDate: 'desc',
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Either provide jobIds array or set syncAll=true' },
        { status: 400 }
      );
    }

    if (jobs.length === 0) {
      return NextResponse.json({
        success: true,
        synced: 0,
        failed: 0,
        message: 'No jobs to sync',
      });
    }

    // Sync each job
    const results = {
      synced: [] as any[],
      failed: [] as any[],
    };

    for (const job of jobs) {
      try {
        const response = await syncJobToTopOneHire(job, apiEndpoint, apiKey);
        results.synced.push({
          id: job.id,
          title: job.title,
          response: response.id || response.jobId || 'Success',
        });
      } catch (error: any) {
        results.failed.push({
          id: job.id,
          title: job.title,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      synced: results.synced.length,
      failed: results.failed.length,
      total: jobs.length,
      details: {
        synced: results.synced.slice(0, 20), // Limit response size
        failed: results.failed.slice(0, 20),
      },
    });
  } catch (error: any) {
    console.error('Job auto import error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync jobs to Top One Hire' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return configuration or status
  return NextResponse.json({
    message: 'Job Auto Import API',
    instructions:
      'POST with apiEndpoint, apiKey (optional), jobIds (optional array), or syncAll=true to sync jobs to Top One Hire',
  });
}
