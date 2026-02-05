'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function EmployerDashboard() {
  const router = useRouter();
  const [employer, setEmployer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('employerAuth');
    const employerData = localStorage.getItem('employerUser');

    if (!auth || !employerData) {
      router.push('/login');
    } else {
      setEmployer(JSON.parse(employerData));
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('employerAuth');
    localStorage.removeItem('employerUser');
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
      <Header activePage="employer-dashboard" />
      
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome, {employer?.fullName}!</h2>
            <div className="space-y-2 text-gray-600">
              <p><strong>Company:</strong> {employer?.companyName}</p>
              <p><strong>Email:</strong> {employer?.email}</p>
              <p><strong>Website:</strong> {employer?.website}</p>
              <p><strong>Location:</strong> {employer?.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Post a Job</h3>
              <p className="text-gray-600 mb-4">Create a new job posting</p>
              <button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500 transition-colors">
                Post Job
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Jobs</h3>
              <p className="text-gray-600 mb-4">View and manage your job postings</p>
              <button className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors">
                View Jobs
              </button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Applications</h3>
              <p className="text-gray-600 mb-4">Review job applications</p>
              <button className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500 transition-colors">
                View Applications
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
