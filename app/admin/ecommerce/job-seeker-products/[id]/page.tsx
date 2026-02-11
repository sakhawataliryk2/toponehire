'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function EditJobSeekerProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '0',
    billingInterval: 'MONTHLY' as 'MONTHLY' | 'YEARLY',
    firstMonthFree: false,
    postResumes: false,
    jobAccess: false,
    assignedOnRegistration: false,
    active: true,
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product && data.product.type === 'JOB_SEEKER') {
          const p = data.product;
          setForm({
            name: p.name || '',
            description: p.description || '',
            price: String(p.price ?? 0),
            billingInterval: p.billingInterval === 'YEARLY' ? 'YEARLY' : 'MONTHLY',
            firstMonthFree: Boolean(p.firstMonthFree),
            postResumes: Boolean(p.postResumes),
            jobAccess: Boolean(p.jobAccess),
            assignedOnRegistration: Boolean(p.assignedOnRegistration),
            active: p.active !== false,
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
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          price: parseFloat(form.price) || 0,
          billingInterval: form.billingInterval,
          firstMonthFree: form.firstMonthFree,
          postResumes: form.postResumes,
          jobAccess: form.jobAccess,
          assignedOnRegistration: form.assignedOnRegistration,
          active: form.active,
        }),
      });
      if (res.ok) router.push('/admin/ecommerce/job-seeker-products');
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Product (Job Seeker)</h1>
          <Link href="/admin/ecommerce/job-seeker-products" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Back</Link>
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
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.postResumes} onChange={(e) => setForm({ ...form, postResumes: e.target.checked })} /> Post Resumes</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.jobAccess} onChange={(e) => setForm({ ...form, jobAccess: e.target.checked })} /> Job Access</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.assignedOnRegistration} onChange={(e) => setForm({ ...form, assignedOnRegistration: e.target.checked })} /> Assigned to job seeker upon registration</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save Changes</button>
            <Link href="/admin/ecommerce/job-seeker-products" className="px-6 py-2 bg-gray-200 rounded-lg">Cancel</Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
