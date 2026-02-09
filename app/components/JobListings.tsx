'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import JobCard from './JobCard';

interface ApiJob {
  id: string;
  title: string;
  employer: string;
  jobDescription: string;
  location: string;
  postingDate: string;
}

function formatJobDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function JobListings() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs?limit=10');
        const contentType = res.headers.get('content-type');
        if (!res.ok || !contentType?.includes('application/json')) {
          setError('Failed to load jobs');
          setJobs([]);
          return;
        }
        const data = await res.json();
        setJobs(data.jobs ?? []);
        setError(null);
      } catch {
        setError('Failed to load jobs');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Latest Jobs</h3>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Latest Jobs</h3>
        <p className="text-red-600">{error}</p>
        <div className="mt-4">
          <Link href="/jobs" className="text-yellow-500 hover:text-yellow-600 font-semibold">
            View all jobs →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Latest Jobs</h3>
      <div className="space-y-6">
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet. Check back later.</p>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              date={formatJobDate(job.postingDate)}
              title={job.title}
              description={job.jobDescription}
              company={job.employer}
              location={job.location}
            />
          ))
        )}
      </div>
      <div className="mt-8 text-center">
        <Link href="/jobs" className="text-yellow-500 hover:text-yellow-600 font-semibold">
          View all jobs →
        </Link>
      </div>
    </section>
  );
}
