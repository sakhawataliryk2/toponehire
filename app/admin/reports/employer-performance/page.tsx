'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';

interface EmployerPerformance {
  id: string;
  employer: string;
  email: string;
  jobsPosted: number;
  jobViews: number;
  applications: number;
  applyClicks: number;
  applyRate: string;
  activeJobs: number;
  joinedDate: string;
}

interface PerformanceData {
  employers: EmployerPerformance[];
  totals: {
    totalEmployers: number;
    totalJobsPosted: number;
    totalViews: number;
    totalApplications: number;
    totalApplyClicks: number;
    overallApplyRate: string;
  };
  recordsFound: number;
}

export default function EmployerPerformancePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [timeRange, setTimeRange] = useState('Last 30 days');

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
      });
      
      const response = await fetch(`/api/admin/reports/employer-performance?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error('Failed to fetch employer performance data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, search, timeRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
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
          <h1 className="text-3xl font-bold text-gray-900">Employer Performance</h1>
          <div className="text-sm text-gray-600">
            {data?.recordsFound || 0} records found
          </div>
        </div>

        {/* Summary Stats */}
        {data?.totals && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{data.totals.totalEmployers}</div>
              <div className="text-sm text-gray-600">Total Employers</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{data.totals.totalJobsPosted}</div>
              <div className="text-sm text-gray-600">Total Jobs Posted</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{data.totals.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Views</div>
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
                  placeholder="Search employers..."
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
                    Employer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jobs Posted
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Views
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apply Clicks
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apply Rate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Jobs
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.employers.map((employer) => (
                  <tr key={employer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{employer.employer}</div>
                        <div className="text-sm text-gray-500">{employer.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employer.jobsPosted}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employer.jobViews.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employer.applications}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employer.applyClicks}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        parseFloat(employer.applyRate) > 5 ? 'text-green-600' :
                        parseFloat(employer.applyRate) > 2 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {employer.applyRate}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{employer.activeJobs}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{employer.joinedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {(!data?.employers || data.employers.length === 0) && (
            <div className="text-center py-8">
              <div className="text-gray-500">No employer performance data found</div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
