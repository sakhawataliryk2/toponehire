'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';

export default function RssXmlFeedsPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [format, setFormat] = useState<'rss' | 'xml' | 'monster' | 'indeed' | 'google'>('rss');
  const [limit, setLimit] = useState('100');
  const [category, setCategory] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) router.push('/admin/login');
    else setAuth(true);
  }, [router]);

  useEffect(() => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    setBaseUrl(url);
  }, []);

  if (!auth) return null;

  const getFeedUrl = () => {
    let url = `${baseUrl}/jobs-feed.xml?format=${format}&limit=${limit}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    return url;
  };

  const getFormatSpecificUrl = (fmt: string) => {
    if (fmt === 'monster') return `${baseUrl}/feeds/monster.xml${limit !== '100' ? `?limit=${limit}` : ''}`;
    if (fmt === 'indeed') return `${baseUrl}/feeds/indeed.xml${limit !== '100' ? `?limit=${limit}` : ''}`;
    if (fmt === 'google') return `${baseUrl}/feeds/google-jobs.xml${limit !== '100' ? `?limit=${limit}` : ''}`;
    return getFeedUrl();
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Feed URL copied to clipboard!');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">RSS/XML Feeds</h1>
        <p className="text-gray-600 mb-6">
          Export your job listings in RSS or XML format to share with other job boards like Monster, Indeed, etc.
        </p>

        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl space-y-6">
          {/* Feed Configuration */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Feed Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Jobs in Feed
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Maximum number of jobs to include (1-1000)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category (Optional)
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Information Technology"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to include all categories</p>
              </div>
            </div>
          </div>

          {/* Feed URLs */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Feed URLs</h2>
            
            <div className="space-y-4">
              {/* Standard XML Feed */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Standard XML Feed</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Universal</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Generic XML format compatible with most job boards</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${baseUrl}/jobs-feed.xml?format=xml&limit=${limit}${category ? `&category=${category}` : ''}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/jobs-feed.xml?format=xml&limit=${limit}${category ? `&category=${category}` : ''}`)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Copy
                  </button>
                  <a
                    href={`${baseUrl}/jobs-feed.xml?format=xml&limit=${limit}${category ? `&category=${category}` : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Preview
                  </a>
                </div>
              </div>

              {/* RSS Feed */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">RSS 2.0 Feed</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Standard</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Standard RSS format for feed readers and aggregators</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${baseUrl}/jobs-feed.xml?format=rss&limit=${limit}${category ? `&category=${category}` : ''}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/jobs-feed.xml?format=rss&limit=${limit}${category ? `&category=${category}` : ''}`)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Copy
                  </button>
                  <a
                    href={`${baseUrl}/jobs-feed.xml?format=rss&limit=${limit}${category ? `&category=${category}` : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Preview
                  </a>
                </div>
              </div>

              {/* Monster.com Feed */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Monster.com Feed</h3>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Monster</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Optimized XML format for Monster.com job board</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${baseUrl}/feeds/monster.xml${limit !== '100' ? `?limit=${limit}` : ''}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/feeds/monster.xml${limit !== '100' ? `?limit=${limit}` : ''}`)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Copy
                  </button>
                  <a
                    href={`${baseUrl}/feeds/monster.xml${limit !== '100' ? `?limit=${limit}` : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Preview
                  </a>
                </div>
              </div>

              {/* Indeed.com Feed */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Indeed.com Feed</h3>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Indeed</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Optimized XML format for Indeed.com job board</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${baseUrl}/feeds/indeed.xml${limit !== '100' ? `?limit=${limit}` : ''}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/feeds/indeed.xml${limit !== '100' ? `?limit=${limit}` : ''}`)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Copy
                  </button>
                  <a
                    href={`${baseUrl}/feeds/indeed.xml${limit !== '100' ? `?limit=${limit}` : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Preview
                  </a>
                </div>
              </div>

              {/* Google Jobs Feed */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Google Jobs Feed</h3>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Google</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">JSON-LD format for Google Jobs search results</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${baseUrl}/feeds/google-jobs.xml${limit !== '100' ? `?limit=${limit}` : ''}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(`${baseUrl}/feeds/google-jobs.xml${limit !== '100' ? `?limit=${limit}` : ''}`)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    Copy
                  </button>
                  <a
                    href={`${baseUrl}/feeds/google-jobs.xml${limit !== '100' ? `?limit=${limit}` : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Preview
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Instructions */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Integration Instructions</h3>
            <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-3">
              <div>
                <strong className="text-gray-900">For Monster.com:</strong>
                <p className="text-gray-600 mt-1">
                  Submit your Monster feed URL (<code className="bg-white px-1 rounded">{baseUrl}/feeds/monster.xml</code>) through their job posting partner portal or contact their support team.
                </p>
              </div>
              <div>
                <strong className="text-gray-900">For Indeed.com:</strong>
                <p className="text-gray-600 mt-1">
                  Use the Indeed feed URL (<code className="bg-white px-1 rounded">{baseUrl}/feeds/indeed.xml</code>) in your Indeed employer account under "Job Postings" → "Feed Settings" → "XML Feed".
                </p>
              </div>
              <div>
                <strong className="text-gray-900">For Google Jobs:</strong>
                <p className="text-gray-600 mt-1">
                  Implement JSON-LD structured data on your job detail pages, or submit your Google Jobs feed URL (<code className="bg-white px-1 rounded">{baseUrl}/feeds/google-jobs.xml</code>) through Google Search Console.
                </p>
              </div>
              <div>
                <strong className="text-gray-900">For Other Job Boards:</strong>
                <p className="text-gray-600 mt-1">
                  Contact their support team and provide your RSS feed URL (<code className="bg-white px-1 rounded">{baseUrl}/jobs-feed.xml?format=rss</code>) or XML feed URL (<code className="bg-white px-1 rounded">{baseUrl}/jobs-feed.xml?format=xml</code>).
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-gray-600">
                  <strong>Note:</strong> All feeds automatically update with your latest active job postings. Only jobs with status "Active" are included. Feeds are cached for 1 hour for better performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
