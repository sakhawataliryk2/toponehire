'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';

interface CustomField {
  id: string;
  caption: string;
  type: string;
  context: string;
  required: boolean;
  hidden: boolean;
  order: number;
}

const fieldTypeLabels: Record<string, string> = {
  TEXT_FIELD: 'Text Field',
  TEXT_AREA: 'Text Area',
  EMAIL: 'Email',
  PASSWORD: 'Password',
  NUMBER: 'Number',
  DATE: 'Date',
  DROPDOWN: 'Dropdown',
  MULTISELECT: 'Multiselect',
  CHECKBOX: 'Checkbox',
  RADIO: 'Radio',
  FILE: 'File',
  PICTURE: 'Picture',
  LOCATION: 'Location',
  COMPLEX: 'Complex',
  SOCIAL_NETWORK: 'Social Network',
  GALLERY: 'Gallery',
  ACCOUNT_TYPE: 'Account Type',
};

export default function CustomFieldsPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'EMPLOYER' | 'JOB_SEEKER' | 'RESUME' | 'APPLICATION'>('EMPLOYER');
  const [fields, setFields] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFields = async (context: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/custom-fields?context=${context}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Failed to fetch fields:', errorData);
        setFields([]);
        return;
      }
      const data = await res.json();
      if (data.fields) {
        setFields(data.fields);
      } else {
        setFields([]);
      }
    } catch (e: any) {
      console.error('Error fetching fields:', e);
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) router.push('/admin/login');
    else setAuth(true);
  }, [router]);

  useEffect(() => {
    if (auth) fetchFields(activeTab);
  }, [auth, activeTab]);

  const handleDelete = async (id: string, caption: string) => {
    if (!confirm(`Delete field "${caption}"?`)) return;
    try {
      const res = await fetch(`/api/admin/custom-fields/${id}`, { method: 'DELETE' });
      if (res.ok) fetchFields(activeTab);
      else alert('Failed to delete');
    } catch (e) {
      alert('Error deleting');
    }
  };

  if (!auth) return null;

  const tabs = [
    { id: 'EMPLOYER' as const, label: 'Employer Fields' },
    { id: 'JOB_SEEKER' as const, label: 'Job Seeker Fields' },
    { id: 'RESUME' as const, label: 'Resume Fields' },
    { id: 'APPLICATION' as const, label: 'Application Fields' },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Custom Fields</h1>
          <Link
            href={`/admin/listing-fields/custom-fields/new?context=${activeTab}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add New {tabs.find(t => t.id === activeTab)?.label.replace(' Fields', '')} Field
          </Link>
        </div>

        <div className="mb-4 border-b border-gray-200">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Caption</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Required</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : fields.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No fields. <Link href={`/admin/listing-fields/custom-fields/new?context=${activeTab}`} className="text-purple-600 hover:underline">Add one</Link>
                  </td>
                </tr>
              ) : (
                fields.map((field) => (
                  <tr key={field.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{field.caption}</div>
                      {field.hidden && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">Hidden</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{fieldTypeLabels[field.type] || field.type}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${field.required ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        {field.required ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/listing-fields/custom-fields/${field.id}`}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(field.id, field.caption)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
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
