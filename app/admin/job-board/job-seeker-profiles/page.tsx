'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';

interface JobSeeker {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function JobSeekerProfilesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jobSeekers, setJobSeekers] = useState<JobSeeker[]>([]);
  const [filteredJobSeekers, setFilteredJobSeekers] = useState<JobSeeker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobSeekers, setSelectedJobSeekers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobSeekerToDelete, setJobSeekerToDelete] = useState<string | null>(null);

  // Fetch job seekers from database
  useEffect(() => {
    const fetchJobSeekers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/job-seekers');
        const data = await response.json();
        if (data.jobSeekers) {
          const formattedJobSeekers = data.jobSeekers.map((jobSeeker: any) => ({
            ...jobSeeker,
            createdAt: new Date(jobSeeker.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            updatedAt: new Date(jobSeeker.updatedAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setJobSeekers(formattedJobSeekers);
          setFilteredJobSeekers(formattedJobSeekers);
        }
      } catch (error) {
        console.error('Error fetching job seekers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchJobSeekers();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    const filterJobSeekers = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        const response = await fetch(`/api/job-seekers?${params.toString()}`);
        const data = await response.json();
        if (data.jobSeekers) {
          const formattedJobSeekers = data.jobSeekers.map((jobSeeker: any) => ({
            ...jobSeeker,
            createdAt: new Date(jobSeeker.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            updatedAt: new Date(jobSeeker.updatedAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setFilteredJobSeekers(formattedJobSeekers);
        }
      } catch (error) {
        console.error('Error filtering job seekers:', error);
      }
    };

    if (isAuthenticated) {
      filterJobSeekers();
    }
  }, [searchQuery, isAuthenticated]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedJobSeekers = [...filteredJobSeekers].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = (a as any)[sortColumn];
    const bValue = (b as any)[sortColumn];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedJobSeekers(sortedJobSeekers.map((jobSeeker) => jobSeeker.id));
    } else {
      setSelectedJobSeekers([]);
    }
  };

  const handleSelectJobSeeker = (jobSeekerId: string) => {
    setSelectedJobSeekers((prev) =>
      prev.includes(jobSeekerId) ? prev.filter((id) => id !== jobSeekerId) : [...prev, jobSeekerId]
    );
  };

  const handleDelete = (jobSeekerId: string) => {
    setJobSeekerToDelete(jobSeekerId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!jobSeekerToDelete) return;

    try {
      const response = await fetch(`/api/job-seekers/${jobSeekerToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the list
        const response = await fetch('/api/job-seekers');
        const data = await response.json();
        if (data.jobSeekers) {
          const formattedJobSeekers = data.jobSeekers.map((jobSeeker: any) => ({
            ...jobSeeker,
            createdAt: new Date(jobSeeker.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            updatedAt: new Date(jobSeeker.updatedAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setJobSeekers(formattedJobSeekers);
          setFilteredJobSeekers(formattedJobSeekers);
        }
        setShowDeleteModal(false);
        setJobSeekerToDelete(null);
        setSelectedJobSeekers([]);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to delete job seeker'}`);
      }
    } catch (error) {
      console.error('Error deleting job seeker:', error);
      alert('An error occurred while deleting the job seeker');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedJobSeekers.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedJobSeekers.length} job seeker(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedJobSeekers.map((id) =>
          fetch(`/api/job-seekers/${id}`, {
            method: 'DELETE',
          })
        )
      );

      // Refresh the list
      const response = await fetch('/api/job-seekers');
      const data = await response.json();
      if (data.jobSeekers) {
        const formattedJobSeekers = data.jobSeekers.map((jobSeeker: any) => ({
          ...jobSeeker,
          createdAt: new Date(jobSeeker.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          updatedAt: new Date(jobSeeker.updatedAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
        setJobSeekers(formattedJobSeekers);
        setFilteredJobSeekers(formattedJobSeekers);
      }
      setSelectedJobSeekers([]);
    } catch (error) {
      console.error('Error deleting job seekers:', error);
      alert('An error occurred while deleting job seekers');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Job Seeker Profiles</h1>
          <div className="flex items-center gap-3">
            {selectedJobSeekers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Selected ({selectedJobSeekers.length})
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by email, name, phone, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Job Seeker Count */}
        {loading ? (
          <p className="text-gray-600 mb-4">Loading job seekers...</p>
        ) : (
          <p className="text-gray-600 mb-4">{filteredJobSeekers.length} job seeker(s) found</p>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedJobSeekers.length === sortedJobSeekers.length && sortedJobSeekers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Email
                      {sortColumn === 'email' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                          />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <button
                      onClick={() => handleSort('firstName')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      First Name
                      {sortColumn === 'firstName' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                          />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <button
                      onClick={() => handleSort('lastName')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Last Name
                      {sortColumn === 'lastName' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                          />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <button
                      onClick={() => handleSort('phone')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Phone
                      {sortColumn === 'phone' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                          />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <button
                      onClick={() => handleSort('location')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Location
                      {sortColumn === 'location' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                          />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Created At
                      {sortColumn === 'createdAt' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                          />
                        </svg>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Loading job seekers...
                    </td>
                  </tr>
                ) : sortedJobSeekers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      No job seekers found
                    </td>
                  </tr>
                ) : (
                  sortedJobSeekers.map((jobSeeker) => (
                    <tr key={jobSeeker.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedJobSeekers.includes(jobSeeker.id)}
                          onChange={() => handleSelectJobSeeker(jobSeeker.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{jobSeeker.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{jobSeeker.firstName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{jobSeeker.lastName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{jobSeeker.phone || <span className="text-gray-400">-</span>}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{jobSeeker.location || <span className="text-gray-400">-</span>}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{jobSeeker.createdAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/job-board/job-seeker-profiles/${jobSeeker.id}`}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(jobSeeker.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this job seeker? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setJobSeekerToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

