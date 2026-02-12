'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';

interface JobType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  caption: string;
  required: boolean;
  hidden: boolean;
  displayAs: string;
  maxChoices: number;
  order: number;
}

export default function JobTypesPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [form, setForm] = useState({
    caption: 'Job Type',
    required: true,
    hidden: false,
    displayAs: 'Dropdown',
    maxChoices: 1,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJobType, setNewJobType] = useState({ name: '', description: '' });

  const fetchJobTypes = async () => {
    try {
      const res = await fetch('/api/admin/job-types');
      const data = await res.json();
      if (data.jobTypes) {
        setJobTypes(data.jobTypes);
        if (data.jobTypes.length > 0) {
          const first = data.jobTypes[0];
          setForm({
            caption: first.caption || 'Job Type',
            required: first.required !== false,
            hidden: Boolean(first.hidden),
            displayAs: first.displayAs || 'Dropdown',
            maxChoices: first.maxChoices || 1,
          });
        }
      }
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
    if (auth) fetchJobTypes();
  }, [auth]);

  const handleSaveProperties = async () => {
    setSaving(true);
    try {
      await Promise.all(
        jobTypes.map((jt) =>
          fetch(`/api/admin/job-types/${jt.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              caption: form.caption,
              required: form.required,
              hidden: form.hidden,
              displayAs: form.displayAs,
              maxChoices: form.maxChoices,
            }),
          })
        )
      );
      alert('Properties saved');
      fetchJobTypes();
    } catch (e) {
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleAddJobType = async () => {
    if (!newJobType.name.trim()) {
      alert('Name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/job-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newJobType.name,
          description: newJobType.description || null,
          caption: form.caption,
          required: form.required,
          hidden: form.hidden,
          displayAs: form.displayAs,
          maxChoices: form.maxChoices,
        }),
      });
      if (res.ok) {
        setNewJobType({ name: '', description: '' });
        setShowAddForm(false);
        fetchJobTypes();
      } else {
        alert((await res.json()).error || 'Failed to add');
      }
    } catch (e) {
      alert('Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete job type "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/job-types/${id}`, { method: 'DELETE' });
      if (res.ok) fetchJobTypes();
      else alert('Failed to delete');
    } catch (e) {
      alert('Error deleting');
    }
  };

  if (!auth) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Job Types</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Properties */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Job Type Properties</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption *</label>
                <input
                  type="text"
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display as</label>
                <select
                  value={form.displayAs}
                  onChange={(e) => setForm({ ...form, displayAs: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="Dropdown">Dropdown</option>
                  <option value="MultiList">MultiList</option>
                  <option value="Radio">Radio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max number of choices to select
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.maxChoices}
                  onChange={(e) => setForm({ ...form, maxChoices: parseInt(e.target.value, 10) || 1 })}
                  className="w-32 px-4 py-2 border rounded-lg"
                />
              </div>
              <button
                onClick={handleSaveProperties}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>

          {/* Right: List Items */}
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">List Items</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {showAddForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <input
                  type="text"
                  placeholder="Job Type Name *"
                  value={newJobType.name}
                  onChange={(e) => setNewJobType({ ...newJobType, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newJobType.description}
                  onChange={(e) => setNewJobType({ ...newJobType, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddJobType}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewJobType({ name: '', description: '' });
                    }}
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : jobTypes.length === 0 ? (
              <p className="text-gray-500">No job types. Add one above.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {jobTypes.map((jt) => (
                  <div
                    key={jt.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <span className="font-medium text-gray-900">{jt.name}</span>
                    <button
                      onClick={() => handleDelete(jt.id, jt.name)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
