'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';

interface Employer {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  location: string;
  companyName: string;
  website: string;
  logoUrl: string | null;
  companyDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function EmployerProfilesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [filteredEmployers, setFilteredEmployers] = useState<Employer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployers, setSelectedEmployers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employerToDelete, setEmployerToDelete] = useState<string | null>(null);

  // Fetch employers from database
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/employers');
        const data = await response.json();
        if (data.employers) {
          const formattedEmployers = data.employers.map((employer: any) => ({
            ...employer,
            createdAt: new Date(employer.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            updatedAt: new Date(employer.updatedAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setEmployers(formattedEmployers);
          setFilteredEmployers(formattedEmployers);
        }
      } catch (error) {
        console.error('Error fetching employers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchEmployers();
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
    const filterEmployers = async () => {
      try {
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        const response = await fetch(`/api/employers?${params.toString()}`);
        const data = await response.json();
        if (data.employers) {
          const formattedEmployers = data.employers.map((employer: any) => ({
            ...employer,
            createdAt: new Date(employer.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            updatedAt: new Date(employer.updatedAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setFilteredEmployers(formattedEmployers);
        }
      } catch (error) {
        console.error('Error filtering employers:', error);
      }
    };

    if (isAuthenticated) {
      filterEmployers();
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

  const sortedEmployers = [...filteredEmployers].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = (a as any)[sortColumn];
    const bValue = (b as any)[sortColumn];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedEmployers(sortedEmployers.map((employer) => employer.id));
    } else {
      setSelectedEmployers([]);
    }
  };

  const handleSelectEmployer = (employerId: string) => {
    setSelectedEmployers((prev) =>
      prev.includes(employerId) ? prev.filter((id) => id !== employerId) : [...prev, employerId]
    );
  };

  const handleDelete = (employerId: string) => {
    setEmployerToDelete(employerId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employerToDelete) return;

    try {
      const response = await fetch(`/api/employers/${employerToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the list
        const response = await fetch('/api/employers');
        const data = await response.json();
        if (data.employers) {
          const formattedEmployers = data.employers.map((employer: any) => ({
            ...employer,
            createdAt: new Date(employer.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            updatedAt: new Date(employer.updatedAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setEmployers(formattedEmployers);
          setFilteredEmployers(formattedEmployers);
        }
        setShowDeleteModal(false);
        setEmployerToDelete(null);
        setSelectedEmployers([]);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to delete employer'}`);
      }
    } catch (error) {
      console.error('Error deleting employer:', error);
      alert('An error occurred while deleting the employer');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmployers.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedEmployers.length} employer(s)?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedEmployers.map((id) =>
          fetch(`/api/employers/${id}`, {
            method: 'DELETE',
          })
        )
      );

      // Refresh the list
      const response = await fetch('/api/employers');
      const data = await response.json();
      if (data.employers) {
        const formattedEmployers = data.employers.map((employer: any) => ({
          ...employer,
          createdAt: new Date(employer.createdAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          updatedAt: new Date(employer.updatedAt).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
        setEmployers(formattedEmployers);
        setFilteredEmployers(formattedEmployers);
      }
      setSelectedEmployers([]);
    } catch (error) {
      console.error('Error deleting employers:', error);
      alert('An error occurred while deleting employers');
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
          <h1 className="text-3xl font-bold text-gray-900">Employer Profiles</h1>
          <div className="flex items-center gap-3">
            {selectedEmployers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete Selected ({selectedEmployers.length})
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by email, name, company, or location..."
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

        {/* Employer Count */}
        {loading ? (
          <p className="text-gray-600 mb-4">Loading employers...</p>
        ) : (
          <p className="text-gray-600 mb-4">{filteredEmployers.length} employer(s) found</p>
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
                      checked={selectedEmployers.length === sortedEmployers.length && sortedEmployers.length > 0}
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
                      onClick={() => handleSort('fullName')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Full Name
                      {sortColumn === 'fullName' && (
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
                      onClick={() => handleSort('companyName')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Company
                      {sortColumn === 'companyName' && (
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
                      onClick={() => handleSort('website')}
                      className="flex items-center gap-1 hover:text-blue-600"
                    >
                      Website
                      {sortColumn === 'website' && (
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
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      Loading employers...
                    </td>
                  </tr>
                ) : sortedEmployers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No employers found
                    </td>
                  </tr>
                ) : (
                  sortedEmployers.map((employer) => (
                    <tr key={employer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedEmployers.includes(employer.id)}
                          onChange={() => handleSelectEmployer(employer.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{employer.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{employer.fullName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{employer.companyName}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{employer.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{employer.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {employer.website ? (
                          <a
                            href={employer.website.startsWith('http') ? employer.website : `https://${employer.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {employer.website}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{employer.createdAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/job-board/employer-profiles/${employer.id}`}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(employer.id)}
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
                Are you sure you want to delete this employer? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setEmployerToDelete(null);
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
