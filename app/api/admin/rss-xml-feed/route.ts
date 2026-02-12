import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Generate RSS/XML feed from our jobs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'rss'; // rss or xml
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    // Fetch active jobs
    const jobs = await prisma.job.findMany({
      where: {
        status: 'Active',
      },
      orderBy: {
        postingDate: 'desc',
      },
      take: limit,
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://toponehire.com';
    const siteName = 'TopOneHire';
    const siteDescription = 'Find thousands of live jobs and elevate your career';

    if (format === 'xml') {
      // Simple XML format for job boards
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jobs>
${jobs
  .map(
    (job) => `  <job>
    <id>${job.id}</id>
    <title><![CDATA[${job.title}]]></title>
    <employer><![CDATA[${job.employer}]]></employer>
    <description><![CDATA[${job.jobDescription}]]></description>
    <location><![CDATA[${job.location}]]></location>
    <jobType><![CDATA[${job.jobType}]]></jobType>
    <category><![CDATA[${job.categories}]]></category>
    <salaryFrom>${job.salaryFrom || ''}</salaryFrom>
    <salaryTo>${job.salaryTo || ''}</salaryTo>
    <salaryFrequency>${job.salaryFrequency || 'yearly'}</salaryFrequency>
    <url>${baseUrl}/jobs/${job.id}</url>
    <postedDate>${job.postingDate.toISOString()}</postedDate>
    <expiryDate>${job.expirationDate ? job.expirationDate.toISOString() : ''}</expiryDate>
  </job>`
  )
  .join('\n')}
</jobs>`;

      return new Response(xml, {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
        },
      });
    }

    // RSS 2.0 format
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
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

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('RSS/XML feed error:', error);
    return NextResponse.json({ error: 'Failed to generate feed' }, { status: 500 });
  }
}
