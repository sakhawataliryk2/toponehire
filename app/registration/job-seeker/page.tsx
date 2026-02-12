'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DynamicFormField from '../../components/DynamicFormField';

interface CustomField {
  id: string;
  caption: string;
  type: string;
  required: boolean;
  placeholder?: string | null;
  helpText?: string | null;
  options?: string | null;
}

export default function JobSeekerRegistrationPage() {
  const router = useRouter();
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    agreeToTerms: false,
  });

  useEffect(() => {
    async function fetchCustomFields() {
      try {
        const res = await fetch('/api/custom-fields?context=JOB_SEEKER');
        const data = await res.json();
        if (data.fields) {
          setCustomFields(data.fields);
          // Initialize form data for custom fields
          const initialData: Record<string, any> = {};
          data.fields.forEach((field: CustomField) => {
            const fieldKey = `customField_${field.id}`;
            if (field.type === 'CHECKBOX') {
              initialData[fieldKey] = false;
            } else if (field.type === 'MULTISELECT') {
              initialData[fieldKey] = [];
            } else {
              initialData[fieldKey] = '';
            }
          });
          setFormData(prev => ({ ...prev, ...initialData }));
        }
      } catch (error) {
        console.error('Error fetching custom fields:', error);
      } finally {
        setLoadingFields(false);
      }
    }
    fetchCustomFields();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }));
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [`customField_${fieldId}`]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms of use and privacy policy');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Collect all custom field values
      const submissionData: Record<string, any> = {};
      
      // Add all custom field values
      Object.keys(formData).forEach(key => {
        if (key.startsWith('customField_')) {
          submissionData[key] = formData[key];
        }
      });
      
      // Also include standard fields if they exist (for backward compatibility)
      if (formData.email) submissionData.email = formData.email;
      if (formData.password) submissionData.password = formData.password;
      if (formData.firstName) submissionData.firstName = formData.firstName;
      if (formData.lastName) submissionData.lastName = formData.lastName;
      if (formData.phone) submissionData.phone = formData.phone;
      if (formData.location) submissionData.location = formData.location;

      const response = await fetch('/api/job-seekers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login the user
        localStorage.setItem('jobSeekerAuth', 'true');
        localStorage.setItem('jobSeekerUser', JSON.stringify(data.jobSeeker));
        
        // Redirect to resume creation page
        router.push('/add-listing?listing_type_id=Resume');
      } else {
        setError(data.error || 'Registration failed');
        alert(data.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      alert(err.message || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
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
          {loadingFields ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading form fields...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Dynamic Custom Fields */}
              {customFields.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customFields.map((field) => {
                    const fieldKey = `customField_${field.id}`;
                    // Map standard fields if custom fields match
                    let mappedValue = formData[fieldKey];
                    const captionLower = field.caption.toLowerCase();
                    
                    // Map to standard fields if they match
                    if (captionLower.includes('email') && !mappedValue) mappedValue = formData.email;
                    else if ((captionLower.includes('first name') || captionLower.includes('firstname')) && !mappedValue) mappedValue = formData.firstName;
                    else if ((captionLower.includes('last name') || captionLower.includes('lastname')) && !mappedValue) mappedValue = formData.lastName;
                    else if (captionLower.includes('phone') && !mappedValue) mappedValue = formData.phone;
                    else if (captionLower.includes('location') && !mappedValue) mappedValue = formData.location;
                    else if (captionLower.includes('password') && !mappedValue) mappedValue = formData.password;
                    
                    return (
                      <DynamicFormField
                        key={field.id}
                        field={field}
                        value={mappedValue}
                        onChange={(value) => {
                          handleCustomFieldChange(field.id, value);
                          // Also update standard fields if they match
                          const captionLower = field.caption.toLowerCase();
                          if (captionLower.includes('email')) setFormData(prev => ({ ...prev, email: value }));
                          else if (captionLower.includes('first name') || captionLower.includes('firstname')) setFormData(prev => ({ ...prev, firstName: value }));
                          else if (captionLower.includes('last name') || captionLower.includes('lastname')) setFormData(prev => ({ ...prev, lastName: value }));
                          else if (captionLower.includes('phone')) setFormData(prev => ({ ...prev, phone: value }));
                          else if (captionLower.includes('location')) setFormData(prev => ({ ...prev, location: value }));
                          else if (captionLower.includes('password')) setFormData(prev => ({ ...prev, password: value }));
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Message when no custom fields are configured */}
              {customFields.length === 0 && !loadingFields && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-lg mb-2">No registration fields have been configured yet.</p>
                  <p className="text-gray-500 text-sm">Please contact an administrator to set up the registration form fields.</p>
                </div>
              )}

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
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-12 rounded-lg text-lg transition-colors"
              >
                {isSubmitting ? 'REGISTERING...' : 'REGISTER'}
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
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
