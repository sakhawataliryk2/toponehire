import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// Public XML feed endpoint - /jobs-feed.xml
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'xml'; // xml, rss, monster, indeed, google
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const category = searchParams.get('category'); // Optional category filter

    // Get base URL from request headers or environment variable
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (host ? `${protocol}://${host}` : 'https://toponehire.com');

    // Build where clause
    const where: any = {
      status: 'Active',
    };

    // Filter by category if provided
    if (category) {
      where.categories = {
        contains: category,
      };
    }

    // Fetch active jobs
    const jobs = await prisma.job.findMany({
      where,
      orderBy: {
        postingDate: 'desc',
      },
      take: Math.min(limit, 1000), // Max 1000 jobs
    });

    // Generate feed based on format
    let feedContent = '';
    let contentType = 'application/xml; charset=utf-8';

    switch (format) {
      case 'monster':
        feedContent = generateMonsterXML(jobs, baseUrl);
        break;
      case 'indeed':
        feedContent = generateIndeedXML(jobs, baseUrl);
        break;
      case 'google':
        feedContent = generateGoogleJobsXML(jobs, baseUrl);
        break;
      case 'rss':
        feedContent = generateRSS(jobs, baseUrl);
        contentType = 'application/rss+xml; charset=utf-8';
        break;
      default: // xml
        feedContent = generateStandardXML(jobs, baseUrl);
    }

    return new Response(feedContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*', // Allow CORS for external job boards
      },
    });
  } catch (error) {
    console.error('XML feed error:', error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate feed</error>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
}

// Standard XML format
function generateStandardXML(jobs: any[], baseUrl: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<jobs>
${jobs
  .map(
    (job) => `  <job>
    <id>${escapeXml(job.id)}</id>
    <title><![CDATA[${job.title}]]></title>
    <company><![CDATA[${job.employer}]]></company>
    <location><![CDATA[${job.location}]]></location>
    <description><![CDATA[${job.jobDescription}]]></description>
    <jobType><![CDATA[${job.jobType}]]></jobType>
    <category><![CDATA[${job.categories}]]></category>
    <salaryFrom>${job.salaryFrom || ''}</salaryFrom>
    <salaryTo>${job.salaryTo || ''}</salaryTo>
    <salaryFrequency>${job.salaryFrequency || 'yearly'}</salaryFrequency>
    <apply_url>${baseUrl}/jobs/${job.id}</apply_url>
    <date>${job.postingDate.toISOString().split('T')[0]}</date>
    <postedDate>${job.postingDate.toISOString()}</postedDate>
    <expiryDate>${job.expirationDate ? job.expirationDate.toISOString() : ''}</expiryDate>
  </job>`
  )
  .join('\n')}
</jobs>`;
}

// Monster.com XML format
function generateMonsterXML(jobs: any[], baseUrl: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher>TopOneHire</publisher>
  <publisherurl>${baseUrl}</publisherurl>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <jobs>
${jobs
  .map(
    (job) => `    <job>
      <id>${escapeXml(job.id)}</id>
      <title><![CDATA[${job.title}]]></title>
      <company><![CDATA[${job.employer}]]></company>
      <location><![CDATA[${job.location}]]></location>
      <description><![CDATA[${job.jobDescription}]]></description>
      <jobtype><![CDATA[${job.jobType}]]></jobtype>
      <category><![CDATA[${job.categories}]]></category>
      <url><![CDATA[${baseUrl}/jobs/${job.id}]]></url>
      <date><![CDATA[${job.postingDate.toISOString().split('T')[0]}]]></date>
      <salary>${job.salaryFrom && job.salaryTo ? `${job.salaryFrom}-${job.salaryTo} ${job.salaryFrequency || 'yearly'}` : ''}</salary>
    </job>`
  )
  .join('\n')}
  </jobs>
</source>`;
}

// Indeed.com XML format
function generateIndeedXML(jobs: any[], baseUrl: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher>TopOneHire</publisher>
  <publisherurl>${baseUrl}</publisherurl>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <jobs>
${jobs
  .map(
    (job) => `    <job>
      <jobtitle><![CDATA[${job.title}]]></jobtitle>
      <company><![CDATA[${job.employer}]]></company>
      <city><![CDATA[${extractCity(job.location)}]]></city>
      <state><![CDATA[${extractState(job.location)}]]></state>
      <country>US</country>
      <description><![CDATA[${job.jobDescription}]]></description>
      <jobtype><![CDATA[${job.jobType}]]></jobtype>
      <category><![CDATA[${job.categories}]]></category>
      <url><![CDATA[${baseUrl}/jobs/${job.id}]]></url>
      <date><![CDATA[${job.postingDate.toISOString().split('T')[0]}]]></date>
      <salary>${job.salaryFrom && job.salaryTo ? `${job.salaryFrom}-${job.salaryTo}` : ''}</salary>
    </job>`
  )
  .join('\n')}
  </jobs>
</source>`;
}

// Google Jobs structured data format (JSON-LD embedded in HTML)
function generateGoogleJobsXML(jobs: any[], baseUrl: string): string {
  // Google Jobs uses JSON-LD format, but we'll provide it as XML for consistency
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<jobs>
  <format>google-jobs-json-ld</format>
  <data><![CDATA[${JSON.stringify(jobsJson, null, 2)}]]></data>
</jobs>`;
}

// RSS 2.0 format
function generateRSS(jobs: any[], baseUrl: string): string {
  const siteName = 'TopOneHire';
  const siteDescription = 'Find thousands of live jobs and elevate your career';

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteName} - Job Listings</title>
    <link>${baseUrl}</link>
    <description>${siteDescription}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    ${jobs
      .map(
        (job) => `    <item>
      <title><![CDATA[${job.title} - ${job.employer}]]></title>
      <link>${baseUrl}/jobs/${job.id}</link>
      <guid isPermaLink="false">${job.id}</guid>
      <description><![CDATA[${job.jobDescription.substring(0, 500)}...]]></description>
      <content:encoded><![CDATA[${job.jobDescription}]]></content:encoded>
      <pubDate>${job.postingDate.toUTCString()}</pubDate>
      <category><![CDATA[${job.categories}]]></category>
      <location><![CDATA[${job.location}]]></location>
      <jobType><![CDATA[${job.jobType}]]></jobType>
      <employer><![CDATA[${job.employer}]]></employer>
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`;
}

// Helper functions
function escapeXml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
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
