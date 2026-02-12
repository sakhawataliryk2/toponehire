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

function PaymentMethodIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  if (n === 'stripe') {
    return (
      <div className="w-10 h-10 rounded bg-[#635bff] flex items-center justify-center text-white font-bold text-sm">
        S
      </div>
    );
  }
  if (n === 'paypal') {
    return (
      <div className="w-10 h-10 rounded bg-[#003087] flex items-center justify-center text-white font-bold text-sm">
        P
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
      {name.charAt(0)}
    </div>
  );
}

export default function PaymentMethodsPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

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

  const handleToggleActive = async (id: string, current: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/admin/payment-methods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) fetchMethods();
      else alert('Failed to update');
    } catch (e) {
      alert('Error');
    } finally {
      setTogglingId(null);
    }
  };

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

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">Loading...</div>
        ) : methods.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">No payment methods. Add one above.</div>
        ) : (
          <div className="space-y-4">
            {methods.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between flex-wrap gap-3"
              >
                <div className="flex items-center gap-3">
                  <PaymentMethodIcon name={m.name} />
                  <span className="font-medium text-gray-900">{m.name}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${m.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {m.isActive ? 'Active' : 'Not Active'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(m.id, m.isActive)}
                    disabled={togglingId === m.id}
                    className={
                      m.isActive
                        ? 'px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50'
                        : 'px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1'
                    }
                  >
                    {togglingId === m.id ? '…' : m.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <Link
                    href={`/admin/ecommerce/payment-methods/${m.id}`}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id, m.name)}
                    className="px-3 py-1.5 text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
