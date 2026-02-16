import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Use raw SQL for saved_jobs so the API works even if the Prisma client was generated
// without the SavedJob model (e.g. stale cache). Table name in DB is "saved_jobs".
type SavedRow = { jobId: string; createdAt: Date };

function getSavedJobDelegate() {
  const client = prisma as unknown as { savedJob?: { findMany: unknown; upsert: unknown; deleteMany: unknown } };
  return client.savedJob;
}

// GET: List saved jobs for a job seeker
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobSeekerId = searchParams.get('jobSeekerId');

    if (!jobSeekerId) {
      return NextResponse.json({ error: 'Job seeker ID required' }, { status: 400 });
    }

    const delegate = getSavedJobDelegate();
    let saved: SavedRow[];

    if (delegate?.findMany) {
      const result = await (delegate as { findMany: (args: unknown) => Promise<SavedRow[]> }).findMany({
        where: { jobSeekerId },
        orderBy: { createdAt: 'desc' },
        select: { jobId: true, createdAt: true },
      });
      saved = result;
    } else {
      const rows = await prisma.$queryRaw<SavedRow[]>`
        SELECT "jobId", "createdAt" FROM saved_jobs
        WHERE "jobSeekerId" = ${jobSeekerId}
        ORDER BY "createdAt" DESC
      `;
      saved = rows;
    }

    const jobIds = saved.map((s) => s.jobId);
    if (jobIds.length === 0) {
      return NextResponse.json({
        savedJobs: [],
        savedJobIds: [],
        count: 0,
      });
    }

    const jobs = await prisma.job.findMany({
      where: { id: { in: jobIds } },
    });

    const jobMap = new Map(jobs.map((j) => [j.id, j]));
    const savedWithJobs = saved
      .map((s) => {
        const job = jobMap.get(s.jobId);
        if (!job) return null;
        return {
          jobId: s.jobId,
          createdAt: s.createdAt instanceof Date ? s.createdAt.toISOString() : s.createdAt,
          job: {
            id: job.id,
            title: job.title,
            employer: job.employer,
            jobDescription: job.jobDescription,
            location: job.location,
            jobType: job.jobType,
            categories: job.categories,
            postingDate: job.postingDate?.toISOString(),
            status: job.status,
          },
        };
      })
      .filter(Boolean);

    return NextResponse.json({
      savedJobs: savedWithJobs,
      savedJobIds: jobIds,
      count: saved.length,
    });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch saved jobs' }, { status: 500 });
  }
}

// POST: Save a job for a job seeker
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobSeekerId, jobId } = body;

    if (!jobSeekerId || !jobId) {
      return NextResponse.json({ error: 'Job seeker ID and job ID required' }, { status: 400 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const seeker = await prisma.jobSeeker.findUnique({ where: { id: jobSeekerId } });
    if (!seeker) {
      return NextResponse.json({ error: 'Job seeker not found' }, { status: 404 });
    }

    const delegate = getSavedJobDelegate();
    if (delegate?.upsert) {
      await (delegate as { upsert: (args: unknown) => Promise<unknown> }).upsert({
        where: { jobSeekerId_jobId: { jobSeekerId, jobId } },
        create: { jobSeekerId, jobId },
        update: {},
      });
    } else {
      const id = randomUUID();
      await prisma.$executeRaw`
        INSERT INTO saved_jobs (id, "jobSeekerId", "jobId", "createdAt")
        VALUES (${id}, ${jobSeekerId}, ${jobId}, NOW())
        ON CONFLICT ("jobSeekerId", "jobId") DO NOTHING
      `;
    }

    return NextResponse.json({ saved: true, jobId });
  } catch (error) {
    console.error('Error saving job:', error);
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
  }
}

// DELETE: Unsave a job for a job seeker
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobSeekerId = searchParams.get('jobSeekerId');
    const jobId = searchParams.get('jobId');

    if (!jobSeekerId || !jobId) {
      return NextResponse.json({ error: 'Job seeker ID and job ID required' }, { status: 400 });
    }

    const delegate = getSavedJobDelegate();
    if (delegate?.deleteMany) {
      await (delegate as { deleteMany: (args: unknown) => Promise<unknown> }).deleteMany({
        where: { jobSeekerId, jobId },
      });
    } else {
      await prisma.$executeRaw`
        DELETE FROM saved_jobs WHERE "jobSeekerId" = ${jobSeekerId} AND "jobId" = ${jobId}
      `;
    }

    return NextResponse.json({ removed: true });
  } catch (error) {
    console.error('Error removing saved job:', error);
    return NextResponse.json({ error: 'Failed to remove saved job' }, { status: 500 });
  }
}
