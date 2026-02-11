'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';

interface PaymentMethod {
  id: string;
  name: string;
  isActive: boolean;
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMethods = async () => {
    try {
      const res = await fetch('/api/admin/payment-methods');
      const data = await res.json();
      if (data.paymentMethods) setMethods(data.paymentMethods);
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
    if (auth) fetchMethods();
  }, [auth]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete payment method "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/payment-methods/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMethods();
      else alert('Failed to delete (may have orders)');
    } catch (e) {
      alert('Error');
    }
  };

  if (!auth) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <Link href="/admin/ecommerce/payment-methods/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : methods.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">No payment methods. Add one above.</td></tr>
              ) : (
                methods.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${m.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {m.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/ecommerce/payment-methods/${m.id}`} className="text-blue-600 hover:underline mr-3">Edit</Link>
                      <button onClick={() => handleDelete(m.id, m.name)} className="text-red-600 hover:underline">Delete</button>
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
