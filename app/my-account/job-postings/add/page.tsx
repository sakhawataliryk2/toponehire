'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function AddJobPage() {
  const router = useRouter();
  const [employer, setEmployer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
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
    expirationDate: '',
  });

  useEffect(() => {
    const auth = localStorage.getItem('employerAuth');
    const employerData = localStorage.getItem('employerUser');

    if (!auth || !employerData) {
      router.push('/login?redirect=/my-account/job-postings/add');
    } else {
      const emp = JSON.parse(employerData);
      setEmployer(emp);
      setFormData(prev => ({
        ...prev,
        applyValue: emp.email || '',
      }));
      setLoading(false);
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
    setSubmitting(true);
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.jobTitle,
          employer: employer?.companyName || employer?.email || '',
          product: null,
          jobDescription: formData.jobDescription,
          jobType: formData.jobType,
          categories: formData.categories,
          location: formData.location,
          salaryFrom: formData.salaryFrom || null,
          salaryTo: formData.salaryTo || null,
          salaryFrequency: formData.salaryFrequency,
          howToApply: formData.howToApply,
          applyValue: formData.applyValue || null,
          featured: false,
          status: 'Active',
          expirationDate: formData.expirationDate || null,
        }),
      });

      if (response.ok) {
        alert('Job posted successfully!');
        router.push('/my-account/job-postings');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to post job'}`);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred while posting the job');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header activePage="my-account" />
      
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">Post a Job</h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-8 space-y-6">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded text-sm font-bold"
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
                  className="p-2 hover:bg-gray-200 rounded text-sm italic"
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
                  className="p-2 hover:bg-gray-200 rounded text-sm underline"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('underline');
                  }}
                  title="Underline"
                >
                  U
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    const url = prompt('Enter URL:');
                    if (url) applyFormat('createLink', url);
                  }}
                  title="Link"
                >
                  🔗
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    applyFormat('insertUnorderedList');
                  }}
                  title="Bullet List"
                >
                  •
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
                  1.
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
                  ⬅
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
                  ⬌
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
                  ➡
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
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
                  🖼️
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
                  ▶️
                </button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                onBlur={handleEditorInput}
                className="w-full min-h-[200px] px-4 py-3 border border-gray-300 border-t-0 rounded-b-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-y"
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

            {/* Job Type & Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 appearance-none bg-white"
                  required
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  placeholder="Click To Select"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="flex gap-4 mb-3">
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
              <input
                type="text"
                placeholder="Enter location details"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <select
                    name="salaryFrequency"
                    value={formData.salaryFrequency}
                    onChange={handleInputChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={submitting}
                className="px-12 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-900 font-bold rounded-lg text-lg transition-colors"
              >
                {submitting ? 'POSTING...' : 'PREVIEW'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
