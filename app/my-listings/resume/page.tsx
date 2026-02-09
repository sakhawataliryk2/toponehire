'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function MyResumesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [jobSeeker, setJobSeeker] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('jobSeekerAuth');
    const jobSeekerData = localStorage.getItem('jobSeekerUser');

    if (!auth || !jobSeekerData) {
      router.push('/login');
    } else {
      const user = JSON.parse(jobSeekerData);
      setJobSeeker(user);
      fetchResumes(user.id);
    }
  }, [router]);

  const fetchResumes = async (jobSeekerId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resumes?jobSeekerId=${jobSeekerId}`);
      const data = await response.json();
      if (data.resumes) {
        setResumes(data.resumes);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();
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
          {/* Page Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'serif' }}>
            My Account
          </h1>

          {/* Tabs Navigation */}
          <div className="flex justify-center border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <Link
                href="/my-listings/resume"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  pathname === '/my-listings/resume'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Resumes
              </Link>
              <Link
                href="/my-listings/applications"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  pathname === '/my-listings/applications'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
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
                  0
                </span>
              </Link>
              <Link
                href="/my-listings/account-settings"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  pathname === '/my-listings/account-settings'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Settings
              </Link>
            </nav>
          </div>

          {/* My Resumes Content */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 uppercase">
              YOU HAVE {resumes.length} RESUME(S)
            </h2>
            <Link
              href="/add-listing?listing_type_id=Resume"
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold uppercase rounded transition-colors"
            >
              CREATE NEW RESUME
            </Link>
          </div>

          {/* Resumes List */}
          <div className="space-y-4">
            {resumes.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">You don't have any resumes yet.</p>
                <Link
                  href="/add-listing?listing_type_id=Resume"
                  className="inline-block px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold uppercase rounded transition-colors"
                >
                  CREATE NEW RESUME
                </Link>
              </div>
            ) : (
              resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {resume.desiredJobTitle}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-semibold text-green-600">{resume.status?.toUpperCase() || 'ACTIVE'}</span>
                        <span>
                          {formatDate(resume.createdAt)} - NEVER EXPIRE
                        </span>
                        <span>{resume.categories}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{resume.views || 0} views</span>
                      <div className="flex gap-2">
                        <Link
                          href={`/resume/${resume.id}`}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          Preview
                        </Link>
                        <Link
                          href={`/add-listing?listing_type_id=Resume&edit=${resume.id}`}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
