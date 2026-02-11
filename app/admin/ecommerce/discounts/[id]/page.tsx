'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function EditDiscountPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'PERCENT' as 'PERCENT' | 'FIXED',
    value: '0',
    maxUses: '1',
    usedCount: '0',
    startDate: '',
    expiryDate: '',
    status: 'NOT_ACTIVE' as string,
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/discounts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.discount) {
          const d = data.discount;
          setForm({
            code: d.code || '',
            type: d.type === 'FIXED' ? 'FIXED' : 'PERCENT',
            value: String(d.value ?? 0),
            maxUses: String(d.maxUses ?? 1),
            usedCount: String(d.usedCount ?? 0),
            startDate: d.startDate ? new Date(d.startDate).toISOString().slice(0, 10) : '',
            expiryDate: d.expiryDate ? new Date(d.expiryDate).toISOString().slice(0, 10) : '',
            status: d.status || 'NOT_ACTIVE',
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.trim(),
          type: form.type,
          value: parseFloat(form.value) || 0,
          maxUses: parseInt(form.maxUses, 10) || 1,
          usedCount: parseInt(form.usedCount, 10) || 0,
          startDate: form.startDate || new Date().toISOString(),
          expiryDate: form.expiryDate || null,
          status: form.status,
        }),
      });
      if (res.ok) router.push('/admin/ecommerce/discounts');
      else alert((await res.json()).error || 'Failed to update');
    } catch (e) {
      alert('Error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Discount</h1>
          <Link href="/admin/ecommerce/discounts" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Back</Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 max-w-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code *</label>
            <input type="text" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'PERCENT' | 'FIXED' })} className="w-full px-4 py-2 border rounded-lg">
              <option value="PERCENT">Percent (%)</option>
              <option value="FIXED">Fixed amount ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
            <input type="number" step="0.01" min="0" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
            <input type="number" min="0" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Used Count</label>
            <input type="number" min="0" value={form.usedCount} onChange={(e) => setForm({ ...form, usedCount: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
              <option value="NOT_ACTIVE">Not Active</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="PENDING_USED">Pending/Used</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save Changes</button>
            <Link href="/admin/ecommerce/discounts" className="px-6 py-2 bg-gray-200 rounded-lg">Cancel</Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
