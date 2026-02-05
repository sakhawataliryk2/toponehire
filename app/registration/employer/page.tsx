'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function EmployerRegistrationPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    location: '',
    password: '',
    companyName: '',
    website: '',
    logo: null as File | null,
    companyDescription: '',
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate company description (strip HTML tags for validation)
    const textContent = formData.companyDescription.replace(/<[^>]*>/g, '').trim();
    if (!textContent) {
      alert('Please enter a company description');
      return;
    }
    
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header activePage="registration" />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Create Employer Profile
            </h1>
            <p className="text-gray-700">
              I already have an Employer account.{' '}
              <Link href="#" className="text-yellow-500 hover:text-yellow-600 underline">
                Sign me in
              </Link>
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Two Column Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                    placeholder="City, State"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-gray-700 font-medium mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-gray-700 font-medium mb-2">
                    Website <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label htmlFor="logo" className="block text-gray-700 font-medium mb-2">
                Logo <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded border border-gray-300 inline-block">
                  Choose file
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
                <span className="text-gray-500 text-sm">
                  {formData.logo ? formData.logo.name : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Company Description */}
            <div>
              <label htmlFor="companyDescription" className="block text-gray-700 font-medium mb-2">
                Company Description <span className="text-red-500">*</span>
              </label>
              {/* Rich Text Editor Toolbar */}
              <div className="border border-gray-300 rounded-t bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
                {/* Bold */}
                <button 
                  type="button" 
                  className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm font-bold text-gray-700" 
                  title="Bold"
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('bold', false);
                  }}
                >
                  B
                </button>
                {/* Italic */}
                <button 
                  type="button" 
                  className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm italic text-gray-700" 
                  title="Italic"
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('italic', false);
                  }}
                >
                  I
                </button>
                {/* Underline */}
                <button 
                  type="button" 
                  className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm underline text-gray-700" 
                  title="Underline"
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('underline', false);
                  }}
                >
                  U
                </button>
                {/* Link */}
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded" 
                  title="Link"
                  onClick={(e) => {
                    e.preventDefault();
                    const url = prompt('Enter URL:');
                    if (url) {
                      document.execCommand('createLink', false, url);
                    }
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
                {/* Unordered List */}
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded" 
                  title="Unordered List"
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('insertUnorderedList', false);
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {/* Ordered List */}
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded" 
                  title="Ordered List"
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('insertOrderedList', false);
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </button>
                {/* Decrease Indent */}
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded" 
                  title="Decrease Indent"
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('outdent', false);
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                {/* Increase Indent */}
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded" 
                  title="Increase Indent"
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('indent', false);
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                {/* Align Left */}
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded" 
                  title="Align Left"
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('justifyLeft', false);
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18" />
                  </svg>
                </button>
                {/* Align Center */}
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded" 
                  title="Align Center"
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('justifyCenter', false);
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M6 12h12M3 18h18" />
                  </svg>
                </button>
                {/* Align Right */}
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded" 
                  title="Align Right"
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('justifyRight', false);
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-18M21 14h-18M21 18h-18M21 6h-18" />
                  </svg>
                </button>
                {/* Justify */}
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded" 
                  title="Justify"
                  onClick={(e) => {
                    e.preventDefault();
                    document.execCommand('justifyFull', false);
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 10h18M3 14h18M3 18h18" />
                  </svg>
                </button>
                {/* Insert Image */}
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded" 
                  title="Insert Image"
                  onClick={(e) => {
                    e.preventDefault();
                    const url = prompt('Enter image URL:');
                    if (url) {
                      document.execCommand('insertImage', false, url);
                    }
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                {/* Insert Video */}
                <button 
                  type="button" 
                  className="p-1.5 hover:bg-gray-200 rounded" 
                  title="Insert Video"
                  onClick={(e) => {
                    e.preventDefault();
                    const url = prompt('Enter video URL:');
                    if (url) {
                      const iframe = `<iframe src="${url}" frameborder="0" allowfullscreen></iframe>`;
                      document.execCommand('insertHTML', false, iframe);
                    }
                  }}
                >
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <div
                id="companyDescription"
                contentEditable
                onInput={(e) => {
                  const content = e.currentTarget.innerHTML;
                  setFormData(prev => ({ ...prev, companyDescription: content }));
                }}
                onBlur={(e) => {
                  const content = e.currentTarget.innerHTML;
                  setFormData(prev => ({ ...prev, companyDescription: content }));
                }}
                className="w-full min-h-[200px] px-4 py-3 border border-gray-300 border-t-0 rounded-b text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-y"
                style={{ whiteSpace: 'pre-wrap' }}
                data-placeholder=""
                suppressContentEditableWarning={true}
              />
              <style jsx>{`
                [contenteditable][data-placeholder]:empty:before {
                  content: attr(data-placeholder);
                  color: #9ca3af;
                  pointer-events: none;
                }
              `}</style>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleCheckboxChange}
                required
                className="mt-1 mr-3 w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
              />
              <label htmlFor="agreeToTerms" className="text-gray-700 text-sm">
                I agree to the{' '}
                <Link href="#" className="text-yellow-500 hover:text-yellow-600 underline">
                  terms of use
                </Link>
                {' '}and{' '}
                <Link href="#" className="text-yellow-500 hover:text-yellow-600 underline">
                  privacy policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-12 rounded-lg text-lg transition-colors"
              >
                REGISTER
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
