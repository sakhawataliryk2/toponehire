'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';

interface Discount {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUses: number;
  usedCount: number;
  startDate: string;
  expiryDate: string | null;
  status: string;
}

export default function DiscountsPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscounts = async () => {
    try {
      const res = await fetch('/api/admin/discounts');
      const data = await res.json();
      if (data.discounts) setDiscounts(data.discounts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) router.push('/admin/login');
    else setAuth(true);
  }, [router]);

  useEffect(() => {
    if (auth) fetchDiscounts();
  }, [auth]);

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete discount code "${code}"?`)) return;
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, { method: 'DELETE' });
      if (res.ok) fetchDiscounts();
      else alert('Failed to delete');
    } catch (e) {
      alert('Error deleting');
    }
  };

  const statusColor = (s: string) => {
    if (s === 'ACTIVE') return 'bg-teal-100 text-teal-800';
    if (s === 'EXPIRED') return 'bg-gray-100 text-gray-600';
    if (s === 'PENDING_USED') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-500';
  };

  if (!auth) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Discounts</h1>
          <p className="text-gray-600 text-sm">Discounts allow you to offer discounts to users for certain products and services.</p>
          <Link href="/admin/ecommerce/discounts/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Discount Code</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Discount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Uses</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Expiry Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : discounts.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No discounts. Add one above.</td></tr>
              ) : (
                discounts.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{d.code}</td>
                    <td className="px-4 py-3 text-gray-900">
                      {d.type === 'PERCENT' ? `${d.value}%` : `$${Number(d.value).toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{d.usedCount}/{d.maxUses}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(d.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600">{d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(d.status)}`}>{d.status.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/ecommerce/discounts/${d.id}`} className="text-blue-600 hover:underline mr-3">Edit</Link>
                      <button onClick={() => handleDelete(d.id, d.code)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
