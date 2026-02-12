'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

const fieldTypes = [
  { value: 'TEXT_FIELD', label: 'Text Field' },
  { value: 'TEXT_AREA', label: 'Text Area' },
  { value: 'EMAIL', label: 'Email' },
  { value: 'PASSWORD', label: 'Password' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'DATE', label: 'Date' },
  { value: 'DROPDOWN', label: 'Dropdown' },
  { value: 'MULTISELECT', label: 'Multiselect' },
  { value: 'CHECKBOX', label: 'Checkbox' },
  { value: 'RADIO', label: 'Radio' },
  { value: 'FILE', label: 'File' },
  { value: 'PICTURE', label: 'Picture' },
  { value: 'LOCATION', label: 'Location' },
  { value: 'COMPLEX', label: 'Complex' },
  { value: 'SOCIAL_NETWORK', label: 'Social Network' },
  { value: 'GALLERY', label: 'Gallery' },
  { value: 'ACCOUNT_TYPE', label: 'Account Type' },
];

export default function EditCustomFieldPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    caption: '',
    type: 'TEXT_FIELD',
    context: 'EMPLOYER',
    required: false,
    hidden: false,
    order: 0,
    options: '',
    placeholder: '',
    helpText: '',
  });

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/custom-fields/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.field) {
          const f = data.field;
          setForm({
            caption: f.caption || '',
            type: f.type || 'TEXT_FIELD',
            context: f.context || 'EMPLOYER',
            required: Boolean(f.required),
            hidden: Boolean(f.hidden),
            order: f.order || 0,
            options: f.options || '',
            placeholder: f.placeholder || '',
            helpText: f.helpText || '',
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
      const res = await fetch(`/api/admin/custom-fields/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: form.caption,
          type: form.type,
          required: form.required,
          hidden: form.hidden,
          order: form.order,
          options: form.options || null,
          placeholder: form.placeholder || null,
          helpText: form.helpText || null,
        }),
      });
      if (res.ok) {
        router.push(`/admin/listing-fields/custom-fields?tab=${form.context}`);
      } else {
        alert((await res.json()).error || 'Failed to update');
      }
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

  const needsOptions = ['DROPDOWN', 'MULTISELECT', 'RADIO'].includes(form.type);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Custom Field</h1>
          <Link
            href={`/admin/listing-fields/custom-fields?tab=${form.context}`}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption *</label>
            <input
              type="text"
              required
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {fieldTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {needsOptions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options (one per line) *
              </label>
              <textarea
                required={needsOptions}
                value={form.options}
                onChange={(e) => setForm({ ...form, options: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg h-24"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={form.placeholder}
              onChange={(e) => setForm({ ...form, placeholder: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Help Text</label>
            <input
              type="text"
              value={form.helpText}
              onChange={(e) => setForm({ ...form, helpText: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 0 })}
              className="w-32 px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.required}
                onChange={(e) => setForm({ ...form, required: e.target.checked })}
              />
              Required
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.hidden}
                onChange={(e) => setForm({ ...form, hidden: e.target.checked })}
              />
              Hidden
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Save Changes
            </button>
            <Link
              href={`/admin/listing-fields/custom-fields?tab=${form.context}`}
              className="px-6 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
