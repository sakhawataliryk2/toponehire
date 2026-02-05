'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function ImportJobsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (selectedFile) {
      // Handle file upload and proceed to next step
      alert(`File selected: ${selectedFile.name}. Processing import...`);
      // In a real app, you would upload the file and process it
    } else {
      alert('Please select a file first');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <nav className="text-sm text-gray-600">
            <Link href="/admin/job-board/job-postings" className="hover:text-blue-600">
              Job Postings
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Import Jobs</span>
          </nav>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Import Jobs</h1>

        {/* File Upload Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV or Excel File <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="px-4 py-2 bg-gray-100 border border-gray-300 rounded cursor-pointer hover:bg-gray-200 transition-colors">
                <span className="text-sm text-gray-700">Choose File</span>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </span>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
