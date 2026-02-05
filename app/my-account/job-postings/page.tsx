'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function JobPostingsPage() {
  const router = useRouter();
  const [employer, setEmployer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('employerAuth');
    const employerData = localStorage.getItem('employerUser');

    if (!auth || !employerData) {
      router.push('/login');
    } else {
      setEmployer(JSON.parse(employerData));
      setLoading(false);
      // Fetch employer's jobs
      fetchEmployerJobs(JSON.parse(employerData).id);
    }
  }, [router]);

  const fetchEmployerJobs = async (employerId: string) => {
    try {
      // In the future, filter jobs by employer
      const response = await fetch('/api/jobs');
      const data = await response.json();
      if (data.jobs) {
        // Filter jobs by employer email or company name
        const employerJobs = data.jobs.filter(
          (job: any) => job.employer === employer?.companyName || job.employer === employer?.email
        );
        setJobs(employerJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
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
      <Header activePage="my-account" />
      
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">My Account</h1>

          {/* Tabs Navigation */}
          <div className="flex justify-center border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <Link
                href="/my-account"
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/my-account/job-postings"
                className="py-4 px-1 border-b-2 border-gray-900 text-gray-900 font-medium text-sm"
              >
                Job Postings
              </Link>
              <Link
                href="/my-account/invoices"
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                Invoices
              </Link>
              <Link
                href="/my-account/company-settings"
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                Company Settings
              </Link>
            </nav>
          </div>

          {/* Job Postings Content */}
          <div className="mb-6 flex justify-end">
            <Link
              href="/admin/job-board/job-postings/add"
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors"
            >
              Post New Job
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {jobs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600 mb-4">You haven't posted any jobs yet.</p>
                <Link
                  href="/admin/job-board/job-postings/add"
                  className="inline-block px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors"
                >
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Applications</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Views</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Posted</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{job.title}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            job.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{job.applications}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{job.views}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(job.postingDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <button className="text-yellow-600 hover:text-yellow-700 font-medium">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
