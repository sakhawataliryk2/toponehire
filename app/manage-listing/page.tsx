'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function ManageListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('id');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [resume, setResume] = useState<any>(null);

  useEffect(() => {
    const auth = localStorage.getItem('jobSeekerAuth');
    if (!auth) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      if (resumeId) {
        fetchResume();
      }
    }
  }, [resumeId, router]);

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resumes/${resumeId}`);
      const data = await response.json();
      if (data.resume) {
        setResume(data.resume);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'serif' }}>
            You have successfully posted your resume.
          </h1>

          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Large green circle with checkmark */}
              <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              
              {/* Decorative arcs */}
              <div className="absolute -top-4 -left-4 w-40 h-40 border-4 border-green-200 border-dashed rounded-full opacity-50"></div>
              <div className="absolute -top-6 -left-6 w-44 h-44 border-4 border-green-100 border-dashed rounded-full opacity-30"></div>
              
              {/* Sparkle icons */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-green-300 rounded-full"></div>
              </div>
              <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-green-300 rounded-full"></div>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-green-300 rounded-full"></div>
              </div>
              <div className="absolute top-1/2 -left-2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-green-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="space-y-4">
            <div>
              <Link
                href={`/resume/${resumeId}`}
                className="text-yellow-500 hover:text-yellow-600 text-lg font-medium underline"
              >
                Preview your resume.
              </Link>
            </div>
            <div>
              <Link
                href="/my-listings/resume"
                className="text-yellow-500 hover:text-yellow-600 text-lg font-medium underline"
              >
                Edit your resume in "My Account" section
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
