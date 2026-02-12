import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Indeed.com XML feed endpoint - /feeds/indeed.xml
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

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
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

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Indeed feed error:', error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate feed</error>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
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
