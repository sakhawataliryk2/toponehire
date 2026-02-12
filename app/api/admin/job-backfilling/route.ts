import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// ZipRecruiter API integration
async function fetchJobsFromZipRecruiter(apiKey: string, searchParams: {
  search?: string;
  location?: string;
  page?: number;
  perPage?: number;
}) {
  // ZipRecruiter API endpoint (example - adjust based on actual API)
  const baseUrl = 'https://api.ziprecruiter.com/jobs/v1';
  const params = new URLSearchParams({
    api_key: apiKey,
    ...(searchParams.search && { search: searchParams.search }),
    ...(searchParams.location && { location: searchParams.location }),
    ...(searchParams.page && { page: String(searchParams.page) }),
    ...(searchParams.perPage && { per_page: String(searchParams.perPage) }),
  });

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`ZipRecruiter API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('ZipRecruiter API error:', error);
    throw error;
  }
}

// Transform ZipRecruiter job to our Job model format
function transformZipRecruiterJob(zipJob: any) {
  return {
    title: zipJob.name || zipJob.title || 'Untitled Job',
    employer: zipJob.company_name || zipJob.hiring_company?.name || 'Unknown Employer',
    jobDescription: zipJob.snippet || zipJob.description || '',
    jobType: zipJob.job_type || 'Full-time',
    categories: zipJob.category || 'General',
    location: zipJob.location || 'Remote',
    salaryFrom: zipJob.salary_min ? String(zipJob.salary_min) : null,
    salaryTo: zipJob.salary_max ? String(zipJob.salary_max) : null,
    salaryFrequency: zipJob.salary_period || 'yearly',
    howToApply: 'url',
    applyValue: zipJob.url || zipJob.apply_url || null,
    featured: false,
    status: 'Active',
    postedBy: 'ZipRecruiter Import',
    postingDate: zipJob.posted_time ? new Date(zipJob.posted_time) : new Date(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, search, location, maxJobs = 50 } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ZipRecruiter API key is required' },
        { status: 400 }
      );
    }

    const jobsToImport: any[] = [];
    const perPage = 25;
    const maxPages = Math.ceil(maxJobs / perPage);

    // Fetch jobs from ZipRecruiter
    for (let page = 1; page <= maxPages && jobsToImport.length < maxJobs; page++) {
      try {
        const zipData = await fetchJobsFromZipRecruiter(apiKey, {
          search,
          location,
          page,
          perPage,
        });

        if (zipData.jobs && Array.isArray(zipData.jobs)) {
          for (const zipJob of zipData.jobs) {
            if (jobsToImport.length >= maxJobs) break;
            jobsToImport.push(transformZipRecruiterJob(zipJob));
          }
        } else if (zipData.results && Array.isArray(zipData.results)) {
          for (const zipJob of zipData.results) {
            if (jobsToImport.length >= maxJobs) break;
            jobsToImport.push(transformZipRecruiterJob(zipJob));
          }
        }

        // If no more jobs, break
        if (!zipData.jobs?.length && !zipData.results?.length) break;
      } catch (error: any) {
        console.error(`Error fetching page ${page}:`, error.message);
        // Continue to next page or break if critical error
        if (error.message.includes('401') || error.message.includes('403')) {
          return NextResponse.json(
            { error: 'Invalid API key or unauthorized access' },
            { status: 401 }
          );
        }
      }
    }

    // Import jobs to database
    const imported = [];
    const skipped = [];

    for (const jobData of jobsToImport) {
      try {
        // Check if job already exists (by title + employer)
        const existing = await prisma.job.findFirst({
          where: {
            title: jobData.title,
            employer: jobData.employer,
            postedBy: 'ZipRecruiter Import',
          },
        });

        if (existing) {
          skipped.push({ title: jobData.title, reason: 'Already exists' });
          continue;
        }

        const job = await prisma.job.create({
          data: jobData,
        });
        imported.push({ id: job.id, title: job.title });
      } catch (error: any) {
        skipped.push({ title: jobData.title, reason: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      skipped: skipped.length,
      details: {
        imported,
        skipped: skipped.slice(0, 10), // Limit skipped details
      },
    });
  } catch (error: any) {
    console.error('Job backfilling error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import jobs from ZipRecruiter' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return configuration or status
  return NextResponse.json({
    message: 'Job Backfilling API',
    instructions: 'POST with apiKey, search, location, and maxJobs to import jobs from ZipRecruiter',
  });
}
