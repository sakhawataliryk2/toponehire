'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function MyApplicationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('jobSeekerAuth');
    if (!auth) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router]);

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
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                Saved Jobs
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
                  0
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

          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">My Applications coming soon...</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
