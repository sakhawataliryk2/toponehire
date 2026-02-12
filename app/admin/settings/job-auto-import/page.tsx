'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';

interface SyncResult {
  synced: number;
  failed: number;
  total: number;
  details?: {
    synced: Array<{ id: string; title: string; response: string }>;
    failed: Array<{ id: string; title: string; error: string }>;
  };
}

export default function JobAutoImportPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    apiEndpoint: '',
    apiKey: '',
    syncAll: false,
  });
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobCount, setJobCount] = useState<number | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) router.push('/admin/login');
    else setAuth(true);
  }, [router]);

  useEffect(() => {
    if (auth) {
      // Fetch total active jobs count
      fetch('/api/jobs?status=Active')
        .then((res) => res.json())
        .then((data) => {
          if (data.jobs) setJobCount(data.jobs.length);
        })
        .catch(console.error);
    }
  }, [auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/admin/job-auto-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiEndpoint: form.apiEndpoint.trim(),
          apiKey: form.apiKey.trim() || undefined,
          syncAll: form.syncAll,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to sync jobs');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!auth) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Auto Import</h1>
        <p className="text-gray-600 mb-6">
          Sync your internal job listings to Top One Hire platform. Configure the API endpoint and credentials to automatically upload jobs.
        </p>

        {jobCount !== null && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900">
              <strong>{jobCount}</strong> active jobs available to sync
            </p>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Top One Hire API Endpoint *
              </label>
              <input
                type="url"
                required
                value={form.apiEndpoint}
                onChange={(e) => setForm({ ...form, apiEndpoint: e.target.value })}
                placeholder="https://api.toponehire.com/jobs/sync"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                The API endpoint where jobs will be synced
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key (optional)
              </label>
              <input
                type="password"
                value={form.apiKey}
                onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                placeholder="Enter API key if required"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.syncAll}
                  onChange={(e) => setForm({ ...form, syncAll: e.target.checked })}
                />
                <span className="text-sm font-medium text-gray-700">
                  Sync all active jobs
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                If unchecked, you can specify job IDs in the API call
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {result && (
              <div className={`p-4 border rounded ${result.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <h3 className={`font-semibold mb-2 ${result.failed === 0 ? 'text-green-900' : 'text-yellow-900'}`}>
                  Sync Complete!
                </h3>
                <p className={result.failed === 0 ? 'text-green-800' : 'text-yellow-800'}>
                  Successfully synced <strong>{result.synced}</strong> out of <strong>{result.total}</strong> jobs.
                  {result.failed > 0 && (
                    <span> <strong>{result.failed}</strong> jobs failed to sync.</span>
                  )}
                </p>
                {result.details?.synced && result.details.synced.length > 0 && (
                  <div className="mt-3 text-sm">
                    <p className="font-medium mb-1">Synced Jobs:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {result.details.synced.slice(0, 10).map((job, i) => (
                        <li key={i}>{job.title}</li>
                      ))}
                      {result.details.synced.length > 10 && (
                        <li className="text-gray-600">...and {result.details.synced.length - 10} more</li>
                      )}
                    </ul>
                  </div>
                )}
                {result.details?.failed && result.details.failed.length > 0 && (
                  <div className="mt-3 text-sm">
                    <p className="font-medium mb-1 text-red-800">Failed Jobs:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {result.details.failed.slice(0, 5).map((job, i) => (
                        <li key={i}>
                          {job.title}: {job.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Syncing Jobs...' : `Sync ${form.syncAll ? 'All' : 'Selected'} Jobs to Top One Hire`}
            </button>
          </form>
        </div>

        <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 p-6 max-w-2xl">
          <h3 className="font-semibold text-gray-900 mb-2">API Usage</h3>
          <p className="text-sm text-gray-600 mb-3">
            You can also sync jobs programmatically using the API:
          </p>
          <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-x-auto">
{`POST /api/admin/job-auto-import
Content-Type: application/json

{
  "apiEndpoint": "https://api.toponehire.com/jobs/sync",
  "apiKey": "your-api-key",
  "syncAll": true
  // OR
  "jobIds": ["job-id-1", "job-id-2"]
}`}
          </pre>
        </div>
      </div>
    </AdminLayout>
  );
}
