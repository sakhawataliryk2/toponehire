'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '../../../components/AdminLayout';

export default function AddNewJobPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    employer: '',
    product: '',
    featured: false,
    jobTitle: '',
    jobDescription: '',
    jobType: '',
    categories: '',
    location: 'Onsite',
    salaryFrom: '',
    salaryTo: '',
    salaryFrequency: 'yearly',
    howToApply: 'email',
    applyValue: '',
    postingDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    expirationDate: '',
  });

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setFormData((prev) => ({ ...prev, jobDescription: editorRef.current!.innerHTML }));
    }
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleEditorInput();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.jobTitle,
          employer: formData.employer,
          product: formData.product || null,
          jobDescription: formData.jobDescription,
          jobType: formData.jobType,
          categories: formData.categories,
          location: formData.location,
          salaryFrom: formData.salaryFrom || null,
          salaryTo: formData.salaryTo || null,
          salaryFrequency: formData.salaryFrequency,
          howToApply: formData.howToApply,
          applyValue: formData.applyValue || null,
          featured: formData.featured,
          status: 'Active',
          expirationDate: formData.expirationDate || null,
        }),
      });

      if (response.ok) {
        alert('Job saved successfully!');
        router.push('/admin/job-board/job-postings');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to save job'}`);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      alert('An error occurred while saving the job');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Breadcrumbs */}
        <div className="mb-4">
          <nav className="text-sm text-gray-600">
            <Link href="/admin/job-board/job-postings" className="hover:text-blue-600">
              Job Postings
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Add New Job</span>
          </nav>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Job</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 max-w-4xl">
          <div className="space-y-6">
            {/* Employer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="employer"
                  value={formData.employer}
                  onChange={handleInputChange}
                  placeholder="Enter company name or email"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <svg
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Product */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
              <div className="relative">
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="">Select Product</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                </select>
                <svg
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Featured */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-t bg-gray-50 p-2 flex items-center gap-2 flex-wrap">
                <select className="px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                  <option>Paragraph</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Heading 3</option>
                </select>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded text-xs font-bold"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('bold');
                  }}
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded text-xs font-bold italic"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('italic');
                  }}
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded text-xs font-bold underline"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('underline');
                  }}
                  title="Underline"
                >
                  U
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded text-xs line-through"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('strikeThrough');
                  }}
                  title="Strikethrough"
                >
                  S
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('createLink', prompt('Enter URL:') || undefined);
                  }}
                  title="Link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    const url = prompt('Enter image URL:');
                    if (url) applyFormat('insertImage', url);
                  }}
                  title="Image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    const url = prompt('Enter video URL:');
                    if (url) {
                      const videoHtml = `<iframe src="${url}" width="560" height="315"></iframe>`;
                      document.execCommand('insertHTML', false, videoHtml);
                      handleEditorInput();
                    }
                  }}
                  title="Video"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('insertUnorderedList');
                  }}
                  title="Bullet List"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('insertOrderedList');
                  }}
                  title="Numbered List"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('justifyLeft');
                  }}
                  title="Align Left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('justifyCenter');
                  }}
                  title="Align Center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('justifyRight');
                  }}
                  title="Align Right"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-2M21 14h-2M21 18h-2M21 6h-2" />
                  </svg>
                </button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                onBlur={handleEditorInput}
                className="w-full min-h-[200px] px-4 py-3 border border-gray-300 border-t-0 rounded-b text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
                data-placeholder="Enter job description..."
                suppressContentEditableWarning={true}
              />
              <style jsx>{`
                [contenteditable][data-placeholder]:empty:before {
                  content: attr(data-placeholder);
                  color: #9ca3af;
                }
              `}</style>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  required
                >
                  <option value="">Select Job Type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                </select>
                <svg
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  placeholder="Click to select"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <svg
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="location"
                    value="Onsite"
                    checked={formData.location === 'Onsite'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Onsite</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="location"
                    value="Remote"
                    checked={formData.location === 'Remote'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Remote</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="location"
                    value="Hybrid"
                    checked={formData.location === 'Hybrid'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Hybrid</span>
                </label>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <span className="text-gray-500 mr-1">$</span>
                  <input
                    type="number"
                    name="salaryFrom"
                    value={formData.salaryFrom}
                    onChange={handleInputChange}
                    placeholder="From"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <span className="text-gray-500">-</span>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <input
                    type="number"
                    name="salaryTo"
                    value={formData.salaryTo}
                    onChange={handleInputChange}
                    placeholder="To"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    name="salaryFrequency"
                    value={formData.salaryFrequency}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hourly">hourly</option>
                    <option value="monthly">monthly</option>
                    <option value="yearly">yearly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* How to Apply */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How to Apply</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="howToApply"
                    value="email"
                    checked={formData.howToApply === 'email'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">By Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="howToApply"
                    value="url"
                    checked={formData.howToApply === 'url'}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">By URL</span>
                </label>
                <div className="flex-1">
                  <input
                    type={formData.howToApply === 'email' ? 'email' : 'url'}
                    name="applyValue"
                    value={formData.applyValue}
                    onChange={handleInputChange}
                    placeholder={formData.howToApply === 'email' ? 'Email address' : 'URL'}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center cursor-help">
                  <span className="text-blue-600 text-xs font-bold">i</span>
                </div>
              </div>
            </div>

            {/* Posting Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Posting Date</label>
              <div className="relative">
                <input
                  type="text"
                  name="postingDate"
                  value={formData.postingDate}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                <svg
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
