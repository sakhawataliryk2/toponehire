'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface SavedJobItem {
  jobId: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    employer: string;
    location: string;
    jobType: string;
    postingDate: string;
    status: string;
  };
}

export default function SavedJobsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [jobSeekerId, setJobSeekerId] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<SavedJobItem[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('jobSeekerAuth');
    const userStr = localStorage.getItem('jobSeekerUser');
    if (!auth || !userStr) {
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      setJobSeekerId(user.id);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchSaved = async () => {
    if (!jobSeekerId) return;
    try {
      const res = await fetch(`/api/job-seekers/saved-jobs?jobSeekerId=${encodeURIComponent(jobSeekerId)}`);
      if (res.ok) {
        const data = await res.json();
        setSavedJobs(data.savedJobs ?? []);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    }
  };

  useEffect(() => {
    if (jobSeekerId) fetchSaved();
  }, [jobSeekerId]);

  // Refetch when user returns to this tab/window (e.g. after saving a job on /jobs)
  useEffect(() => {
    if (!jobSeekerId) return;
    const onFocus = () => fetchSaved();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [jobSeekerId]);

  const removeSaved = async (jobId: string) => {
    if (!jobSeekerId) return;
    try {
      await fetch(
        `/api/job-seekers/saved-jobs?jobSeekerId=${encodeURIComponent(jobSeekerId)}&jobId=${encodeURIComponent(jobId)}`,
        { method: 'DELETE' }
      );
      setSavedJobs((prev) => prev.filter((s) => s.jobId !== jobId));
    } catch (err) {
      console.error('Failed to remove saved job:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'serif' }}>
            My Account
          </h1>

          {/* Tabs Navigation */}
          <div className="flex justify-center border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <Link
                href="/my-listings/resume"
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                My Resumes
              </Link>
              <Link
                href="/my-listings/applications"
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                My Applications
              </Link>
              <Link
                href="/my-listings/saved-jobs"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  pathname === '/my-listings/saved-jobs'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Saved Jobs
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
                  {savedJobs.length}
                </span>
              </Link>
              <Link
                href="/my-listings/account-settings"
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                Account Settings
              </Link>
            </nav>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Jobs</h2>
            {savedJobs.length === 0 ? (
              <p className="text-gray-600 mb-4">You have not saved any jobs yet.</p>
            ) : (
              <ul className="space-y-4">
                {savedJobs.map((item) => (
                  <li
                    key={item.jobId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/jobs/${item.job.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-yellow-600 transition-colors"
                      >
                        {item.job.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">{item.job.employer}</p>
                      <p className="text-sm text-gray-500">
                        {item.job.location} • {item.job.jobType} • Posted {formatDate(item.job.postingDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Link
                        href={`/jobs/${item.job.id}`}
                        className="px-4 py-2 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500 font-medium text-sm"
                      >
                        View Job
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeSaved(item.jobId)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6">
              <Link href="/jobs" className="text-yellow-500 hover:text-yellow-600 font-medium">
                Browse more jobs →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
