'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function JobSeekerDashboard() {
  const router = useRouter();
  const [jobSeeker, setJobSeeker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('jobSeekerAuth');
    const jobSeekerData = localStorage.getItem('jobSeekerUser');

    if (!auth || !jobSeekerData) {
      router.push('/login');
    } else {
      setJobSeeker(JSON.parse(jobSeekerData));
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jobSeekerAuth');
    localStorage.removeItem('jobSeekerUser');
    router.push('/');
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
      <Header activePage="job-seeker-dashboard" />
      
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Job Seeker Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Welcome, {jobSeeker?.firstName} {jobSeeker?.lastName}!
            </h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> {jobSeeker?.email}</p>
              {jobSeeker?.phone && <p><strong>Phone:</strong> {jobSeeker?.phone}</p>}
              {jobSeeker?.location && <p><strong>Location:</strong> {jobSeeker?.location}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Jobs</h3>
              <p className="text-gray-600 mb-4">Search and apply for jobs</p>
              <a
                href="/jobs"
                className="inline-block px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
              >
                Browse Jobs
              </a>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Applications</h3>
              <p className="text-gray-600 mb-4">View your job applications</p>
              <button className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500 transition-colors">
                View Applications
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Resume</h3>
              <p className="text-gray-600 mb-4">Upload or update your resume</p>
              <button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500 transition-colors">
                Manage Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
