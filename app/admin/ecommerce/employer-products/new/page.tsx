'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function NewEmployerProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '0',
    billingInterval: 'MONTHLY' as 'MONTHLY' | 'YEARLY',
    firstMonthFree: false,
    postJobs: false,
    featuredEmployer: false,
    resumeAccess: false,
    assignedOnRegistration: false,
    active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'EMPLOYER',
          name: form.name,
          description: form.description || null,
          price: parseFloat(form.price) || 0,
          billingInterval: form.billingInterval,
          firstMonthFree: form.firstMonthFree,
          postJobs: form.postJobs,
          featuredEmployer: form.featuredEmployer,
          resumeAccess: form.resumeAccess,
          assignedOnRegistration: form.assignedOnRegistration,
          active: form.active,
        }),
      });
      if (res.ok) {
        router.push('/admin/ecommerce/employer-products');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create');
      }
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Product (Employer)</h1>
          <Link href="/admin/ecommerce/employer-products" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Back</Link>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg h-24" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
            <div className="flex gap-2 items-center">
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-32 px-4 py-2 border rounded-lg" />
              <button type="button" onClick={() => setForm({ ...form, billingInterval: 'MONTHLY' })} className={`px-3 py-2 rounded ${form.billingInterval === 'MONTHLY' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>per month</button>
              <button type="button" onClick={() => setForm({ ...form, billingInterval: 'YEARLY' })} className={`px-3 py-2 rounded ${form.billingInterval === 'YEARLY' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}>per year</button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.firstMonthFree} onChange={(e) => setForm({ ...form, firstMonthFree: e.target.checked })} /> First Month is Free</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.postJobs} onChange={(e) => setForm({ ...form, postJobs: e.target.checked })} /> Post Jobs</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.featuredEmployer} onChange={(e) => setForm({ ...form, featuredEmployer: e.target.checked })} /> Featured Employer</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.resumeAccess} onChange={(e) => setForm({ ...form, resumeAccess: e.target.checked })} /> Resume Access</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.assignedOnRegistration} onChange={(e) => setForm({ ...form, assignedOnRegistration: e.target.checked })} /> Assigned to employer upon registration</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save</button>
            <Link href="/admin/ecommerce/employer-products" className="px-6 py-2 bg-gray-200 rounded-lg">Cancel</Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
