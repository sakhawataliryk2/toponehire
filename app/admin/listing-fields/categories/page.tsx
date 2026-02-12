'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';

interface Category {
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
  pageTitle: string | null;
  url: string | null;
  onetOccupation: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    caption: 'Categories',
    required: true,
    hidden: false,
    displayAs: 'MultiList',
    maxChoices: 0,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    pageTitle: '',
    url: '',
    onetOccupation: '',
    metaDescription: '',
    metaKeywords: '',
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
        if (data.categories.length > 0) {
          const first = data.categories[0];
          setForm({
            caption: first.caption || 'Categories',
            required: first.required !== false,
            hidden: Boolean(first.hidden),
            displayAs: first.displayAs || 'MultiList',
            maxChoices: first.maxChoices || 0,
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
    if (auth) fetchCategories();
  }, [auth]);

  const handleSaveProperties = async () => {
    setSaving(true);
    try {
      // Update all categories with new properties (simplified - in real app might have a separate settings endpoint)
      await Promise.all(
        categories.map((cat) =>
          fetch(`/api/admin/categories/${cat.id}`, {
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
      fetchCategories();
    } catch (e) {
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || '',
      description: cat.description || '',
      pageTitle: cat.pageTitle || '',
      url: cat.url || '',
      onetOccupation: cat.onetOccupation || '',
      metaDescription: cat.metaDescription || '',
      metaKeywords: cat.metaKeywords || '',
    });
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryForm.name,
          description: categoryForm.description || null,
          pageTitle: categoryForm.pageTitle || null,
          url: categoryForm.url || null,
          onetOccupation: categoryForm.onetOccupation || null,
          metaDescription: categoryForm.metaDescription || null,
          metaKeywords: categoryForm.metaKeywords || null,
        }),
      });
      if (res.ok) {
        setEditingCategory(null);
        fetchCategories();
      } else {
        alert((await res.json()).error || 'Failed to update');
      }
    } catch (e) {
      alert('Error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      alert('Name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.name,
          description: newCategory.description || null,
          caption: form.caption,
          required: form.required,
          hidden: form.hidden,
          displayAs: form.displayAs,
          maxChoices: form.maxChoices,
        }),
      });
      if (res.ok) {
        setNewCategory({ name: '', description: '' });
        setShowAddForm(false);
        fetchCategories();
      } else {
        alert((await res.json()).error || 'Failed to add');
      }
    } catch (e) {
      alert('Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCategories();
      else alert('Failed to delete');
    } catch (e) {
      alert('Error deleting');
    }
  };

  if (!auth) return null;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Categories</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Properties */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Category Properties</h2>
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
                  <option value="MultiList">MultiList</option>
                  <option value="Dropdown">Dropdown</option>
                  <option value="Checkbox">Checkbox</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max number of choices to select
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.maxChoices}
                  onChange={(e) => setForm({ ...form, maxChoices: parseInt(e.target.value, 10) || 0 })}
                  className="w-32 px-4 py-2 border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">0 = unlimited</p>
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
                  placeholder="Category Name *"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddCategory}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCategory({ name: '', description: '' });
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
            ) : categories.length === 0 ? (
              <p className="text-gray-500">No categories. Add one above.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="flex-1 text-left font-medium text-gray-900"
                    >
                      {cat.name}
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
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

        {/* Category Edit Modal */}
        {editingCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Category</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category Description</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg h-24"
                  />
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">SEO Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category Page Title</label>
                      <input
                        type="text"
                        value={categoryForm.pageTitle}
                        onChange={(e) => setCategoryForm({ ...categoryForm, pageTitle: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="text"
                        value={categoryForm.url}
                        onChange={(e) => setCategoryForm({ ...categoryForm, url: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        O*NET-SOC 2019 Occupation
                      </label>
                      <input
                        type="text"
                        value={categoryForm.onetOccupation}
                        onChange={(e) => setCategoryForm({ ...categoryForm, onetOccupation: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                      <textarea
                        value={categoryForm.metaDescription}
                        onChange={(e) => setCategoryForm({ ...categoryForm, metaDescription: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg h-20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                      <input
                        type="text"
                        value={categoryForm.metaKeywords}
                        onChange={(e) => setCategoryForm({ ...categoryForm, metaKeywords: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveCategory}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="px-6 py-2 bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
