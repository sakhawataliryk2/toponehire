'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';

interface JobAlert {
  id: string;
  email: string;
  keywords: string;
  location: string;
  frequency: string;
  lastSentAt: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function JobAlertsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [frequencyFilter, setFrequencyFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (frequencyFilter) params.set('frequency', frequencyFilter);
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);
      const res = await fetch(`/api/admin/job-alerts?${params.toString()}`);
      const data = await res.json();
      if (data.jobAlerts) setAlerts(data.jobAlerts);
      else setAlerts([]);
    } catch (e) {
      console.error(e);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, frequencyFilter, sortBy, sortOrder]);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) fetchAlerts();
  }, [isAuthenticated, fetchAlerts]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ column }: { column: string }) =>
    sortBy === column ? (
      <span className="inline-block w-4 h-4 ml-1">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    ) : null;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(alerts.map((a) => a.id));
    else setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    const headers = ['Email', 'Signed Up', 'Keywords', 'Location', 'Frequency', 'Last Sent', 'Status'];
    const rows = alerts.map((a) => [
      a.email,
      formatDateTime(a.createdAt),
      a.keywords || '',
      a.location || '',
      a.frequency,
      formatDate(a.lastSentAt),
      a.status,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `job-alerts-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} job alert(s)?`)) return;
    try {
      const res = await fetch(`/api/admin/job-alerts?ids=${selectedIds.join(',')}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedIds([]);
        fetchAlerts();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const next = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`/api/admin/job-alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) fetchAlerts();
      else alert('Failed to update status');
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Job Alerts</h1>
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Delete ({selectedIds.length})
              </button>
            )}
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium border border-gray-300"
            >
              Export
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          {loading ? 'Loading...' : `${alerts.length} job alert${alerts.length !== 1 ? 's' : ''} found`}
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Filter Job Alerts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All frequencies</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left w-10">
                    <input
                      type="checkbox"
                      checked={alerts.length > 0 && selectedIds.length === alerts.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <button onClick={() => handleSort('email')} className="flex items-center hover:text-blue-600">
                      Email <SortIcon column="email" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <button onClick={() => handleSort('createdAt')} className="flex items-center hover:text-blue-600">
                      Signed Up <SortIcon column="createdAt" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Keywords</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <button onClick={() => handleSort('frequency')} className="flex items-center hover:text-blue-600">
                      Frequency <SortIcon column="frequency" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <button onClick={() => handleSort('lastSentAt')} className="flex items-center hover:text-blue-600">
                      Last Sent <SortIcon column="lastSentAt" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    <button onClick={() => handleSort('status')} className="flex items-center hover:text-blue-600">
                      Status <SortIcon column="status" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      Loading job alerts...
                    </td>
                  </tr>
                ) : alerts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No job alerts found.
                    </td>
                  </tr>
                ) : (
                  alerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(alert.id)}
                          onChange={() => toggleSelect(alert.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{alert.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDateTime(alert.createdAt)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[180px] truncate" title={alert.keywords || undefined}>
                        {alert.keywords || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[120px] truncate" title={alert.location || undefined}>
                        {alert.location || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{alert.frequency}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(alert.lastSentAt)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            alert.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {alert.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(alert.id, alert.status)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {alert.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
