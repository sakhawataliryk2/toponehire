'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function JobSeekerRegistrationPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms of use and privacy policy');
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
              Create Job Seeker Profile
            </h1>
            <p className="text-gray-700">
              I already have a Job Seeker account.{' '}
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
                  <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                    placeholder="Your first name"
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
                  <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                    placeholder="Your last name"
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

            {/* reCAPTCHA */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <div className="bg-blue-500 text-white px-3 py-2 rounded text-xs">
                protected by reCAPTCHA
              </div>
              <a href="#" className="text-blue-500 hover:underline">Privacy</a>
              <span>-</span>
              <a href="#" className="text-blue-500 hover:underline">Terms</a>
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
