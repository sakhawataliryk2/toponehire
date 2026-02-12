import { NextRequest } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Monster.com XML feed endpoint - /feeds/monster.xml
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

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Monster feed error:', error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate feed</error>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
}

function escapeXml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
