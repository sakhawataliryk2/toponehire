'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function EditEmployerPage() {
  const router = useRouter();
  const params = useParams();
  const employerId = params?.id as string;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    location: '',
    companyName: '',
    website: '',
    companyDescription: '',
  });

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    const fetchEmployer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/employers/${employerId}`);
        const data = await response.json();
        if (data.employer) {
          setFormData({
            email: data.employer.email || '',
            fullName: data.employer.fullName || '',
            phone: data.employer.phone || '',
            location: data.employer.location || '',
            companyName: data.employer.companyName || '',
            website: data.employer.website || '',
            companyDescription: data.employer.companyDescription || '',
          });
          if (editorRef.current && data.employer.companyDescription) {
            editorRef.current.innerHTML = data.employer.companyDescription;
          }
        }
      } catch (error) {
        console.error('Error fetching employer:', error);
        alert('Failed to load employer data');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && employerId) {
      fetchEmployer();
    }
  }, [isAuthenticated, employerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setFormData((prev) => ({ ...prev, companyDescription: editorRef.current!.innerHTML }));
    }
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleEditorInput();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/employers/${employerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          website: formData.website,
          location: formData.location,
          phone: formData.phone,
          companyDescription: formData.companyDescription,
        }),
      });

      if (response.ok) {
        alert('Employer updated successfully!');
        router.push('/admin/job-board/employer-profiles');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to update employer'}`);
      }
    } catch (error) {
      console.error('Error updating employer:', error);
      alert('An error occurred while updating the employer');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-gray-600">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Employer</h1>
          <Link
            href="/admin/job-board/employer-profiles"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Back to List
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Full name cannot be changed</p>
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Company Description
            </label>
            {/* Rich Text Editor Toolbar */}
            <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyFormat('bold')}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm font-bold"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => applyFormat('italic')}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm italic"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => applyFormat('underline')}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm underline"
                title="Underline"
              >
                U
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button
                type="button"
                onClick={() => applyFormat('justifyLeft')}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                title="Align Left"
              >
                ⬅
              </button>
              <button
                type="button"
                onClick={() => applyFormat('justifyCenter')}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                title="Align Center"
              >
                ⬌
              </button>
              <button
                type="button"
                onClick={() => applyFormat('justifyRight')}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                title="Align Right"
              >
                ➡
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button
                type="button"
                onClick={() => applyFormat('insertUnorderedList')}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                title="Bullet List"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => applyFormat('insertOrderedList')}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                title="Numbered List"
              >
                1.
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Enter URL:');
                  if (url) applyFormat('createLink', url);
                }}
                className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-sm"
                title="Insert Link"
              >
                🔗
              </button>
            </div>
            {/* Rich Text Editor Content */}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              className="w-full min-h-[200px] px-4 py-3 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/admin/job-board/employer-profiles"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
