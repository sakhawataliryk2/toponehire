'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';

interface ImportResult {
  imported: number;
  skipped: number;
  details?: {
    imported: Array<{ id: string; title: string }>;
    skipped: Array<{ title: string; reason: string }>;
  };
}

export default function JobBackfillingPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    apiKey: '',
    search: '',
    location: '',
    maxJobs: '50',
  });
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) router.push('/admin/login');
    else setAuth(true);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/admin/job-backfilling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: form.apiKey.trim(),
          search: form.search.trim() || undefined,
          location: form.location.trim() || undefined,
          maxJobs: parseInt(form.maxJobs, 10) || 50,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setForm({ ...form, apiKey: '' }); // Clear API key after use
      } else {
        setError(data.error || 'Failed to import jobs');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Backfilling</h1>
        <p className="text-gray-600 mb-6">
          Populate your database with jobs from ZipRecruiter. Enter your API key and search criteria to import jobs.
        </p>

        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZipRecruiter API Key *
              </label>
              <input
                type="password"
                required
                value={form.apiKey}
                onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                placeholder="Enter your ZipRecruiter API key"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your API key from{' '}
                <a href="https://www.ziprecruiter.com/employers/api" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  ZipRecruiter API
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Keywords (optional)
              </label>
              <input
                type="text"
                value={form.search}
                onChange={(e) => setForm({ ...form, search: e.target.value })}
                placeholder="e.g. Software Engineer, Nurse"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location (optional)
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. New York, NY or Remote"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Jobs to Import
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={form.maxJobs}
                onChange={(e) => setForm({ ...form, maxJobs: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {result && (
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-semibold text-green-900 mb-2">Import Complete!</h3>
                <p className="text-green-800">
                  Successfully imported <strong>{result.imported}</strong> jobs.
                  {result.skipped > 0 && (
                    <span> Skipped {result.skipped} jobs (duplicates or errors).</span>
                  )}
                </p>
                {result.details?.imported && result.details.imported.length > 0 && (
                  <div className="mt-3 text-sm">
                    <p className="font-medium mb-1">Imported Jobs:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {result.details.imported.slice(0, 10).map((job, i) => (
                        <li key={i}>{job.title}</li>
                      ))}
                      {result.details.imported.length > 10 && (
                        <li className="text-gray-600">...and {result.details.imported.length - 10} more</li>
                      )}
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
              {loading ? 'Importing Jobs...' : 'Import Jobs from ZipRecruiter'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
