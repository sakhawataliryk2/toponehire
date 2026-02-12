import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Google Jobs JSON-LD feed endpoint - /feeds/google-jobs.xml
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const category = searchParams.get('category');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://toponehire.com';

    const where: any = {
      status: 'Active',
    };

    if (category) {
      where.categories = {
        contains: category,
      };
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { postingDate: 'desc' },
      take: Math.min(limit, 1000),
    });

    const jobsJson = jobs.map((job) => ({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: job.title,
      description: job.jobDescription,
      identifier: {
        '@type': 'PropertyValue',
        name: 'TopOneHire',
        value: job.id,
      },
      datePosted: job.postingDate.toISOString(),
      validThrough: job.expirationDate ? job.expirationDate.toISOString() : null,
      employmentType: job.jobType,
      hiringOrganization: {
        '@type': 'Organization',
        name: job.employer,
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: extractCity(job.location),
          addressRegion: extractState(job.location),
          addressCountry: 'US',
        },
      },
      baseSalary: job.salaryFrom
        ? {
            '@type': 'MonetaryAmount',
            currency: 'USD',
            value: {
              '@type': 'QuantitativeValue',
              value: job.salaryFrom,
              unitText: job.salaryFrequency || 'YEAR',
            },
          }
        : null,
      url: `${baseUrl}/jobs/${job.id}`,
    }));

    // Return as JSON (Google Jobs uses JSON-LD)
    return new Response(JSON.stringify(jobsJson, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Google Jobs feed error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate feed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}

function extractCity(location: string): string {
  if (!location) return '';
  const parts = location.split(',');
  return parts[0]?.trim() || '';
}

function extractState(location: string): string {
  if (!location) return '';
  const parts = location.split(',');
  return parts[1]?.trim() || '';
}
