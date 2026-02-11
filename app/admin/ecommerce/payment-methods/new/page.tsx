'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function NewPaymentMethodPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), isActive }),
      });
      if (res.ok) router.push('/admin/ecommerce/payment-methods');
      else alert((await res.json()).error || 'Failed to create');
    } catch (e) {
      alert('Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Add Payment Method</h1>
          <Link href="/admin/ecommerce/payment-methods" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Back</Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 max-w-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Stripe, PayPal" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save</button>
            <Link href="/admin/ecommerce/payment-methods" className="px-6 py-2 bg-gray-200 rounded-lg">Cancel</Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
