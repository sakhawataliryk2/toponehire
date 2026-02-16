'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';

interface JobPerformance {
  id: string;
  title: string;
  employer: string;
  location: string;
  categories: string;
  jobType: string;
  salaryRange: string;
  views: number;
  applications: number;
  applyClicks: number;
  applyRate: string;
  status: string;
  featured: boolean;
  daysActive: number;
  postingDate: string;
  expirationDate: string | null;
}

interface JobPerformanceData {
  jobs: JobPerformance[];
  totals: {
    totalJobs: number;
    totalViews: number;
    totalApplications: number;
    totalApplyClicks: number;
    activeJobs: number;
    featuredJobs: number;
    overallApplyRate: string;
  };
  recordsFound: number;
}

export default function JobPerformancePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<JobPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        timeRange,
        status: statusFilter,
      });
      
      const response = await fetch(`/api/admin/reports/job-performance?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error('Failed to fetch job performance data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, search, timeRange, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Expired': return 'text-red-600 bg-red-100';
      case 'Draft': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Job Performance</h1>
          <div className="text-sm text-gray-600">
            {data?.recordsFound || 0} records found
          </div>
        </div>

        {/* Summary Stats */}
        {data?.totals && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{data.totals.totalJobs}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{data.totals.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{data.totals.totalApplications}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{data.totals.activeJobs}</div>
              <div className="text-sm text-gray-600">Active Jobs</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{data.totals.overallApplyRate}</div>
              <div className="text-sm text-gray-600">Overall Apply Rate</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search jobs, employers, locations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Draft">Draft</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
              <option>All time</option>
            </select>
          </div>
        </div>

        {/* Performance Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apply Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Active
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {job.title}
                          {job.featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {job.location} • {job.jobType} • {job.categories}
                        </div>
                        {job.salaryRange !== '-' && (
                          <div className="text-sm text-gray-500">{job.salaryRange}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{job.employer}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{job.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{job.applications}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        parseFloat(job.applyRate) > 5 ? 'text-green-600' :
                        parseFloat(job.applyRate) > 2 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {job.applyRate}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{job.daysActive}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{job.postingDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {(!data?.jobs || data.jobs.length === 0) && (
            <div className="text-center py-8">
              <div className="text-gray-500">No job performance data found</div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
