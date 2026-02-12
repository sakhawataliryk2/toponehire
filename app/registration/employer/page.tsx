'use client';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
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

export default function EmployerRegistrationPage() {
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({
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

  useEffect(() => {
    async function fetchCustomFields() {
      try {
        const res = await fetch('/api/custom-fields?context=EMPLOYER');
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
      
      // Upload files for custom fields (PICTURE, FILE types)
      const fileUploadPromises: Promise<void>[] = [];
      
      for (const field of customFields) {
        const fieldKey = `customField_${field.id}`;
        const value = formData[fieldKey];
        
        if ((field.type === 'PICTURE' || field.type === 'FILE') && value instanceof File) {
          // Upload file and store URL
          const uploadPromise = (async () => {
            const fileFormData = new FormData();
            fileFormData.append('file', value);
            
            // Use /api/upload/logo for PICTURE types (images), /api/upload for FILE types (documents)
            const uploadEndpoint = field.type === 'PICTURE' ? '/api/upload/logo' : '/api/upload';
            
            const uploadResponse = await fetch(uploadEndpoint, {
              method: 'POST',
              body: fileFormData,
            });
            
            if (uploadResponse.ok) {
              const uploadData = await uploadResponse.json();
              submissionData[fieldKey] = uploadData.url;
            } else {
              const errorData = await uploadResponse.json().catch(() => ({ error: 'Upload failed' }));
              throw new Error(`Failed to upload ${field.caption}: ${errorData.error || 'Unknown error'}`);
            }
          })();
          fileUploadPromises.push(uploadPromise);
        } else {
          // Regular field value
          submissionData[fieldKey] = value;
        }
      }
      
      // Wait for all file uploads to complete
      try {
        await Promise.all(fileUploadPromises);
      } catch (uploadError: any) {
        const errorMessage = uploadError.message || 'Failed to upload file';
        setError(errorMessage);
        alert(errorMessage);
        setIsSubmitting(false);
        return;
      }
      
      // Handle legacy logo field if it exists
      if (formData.logo && formData.logo instanceof File) {
        const logoFormData = new FormData();
        logoFormData.append('file', formData.logo);
        const uploadResponse = await fetch('/api/upload/logo', {
          method: 'POST',
          body: logoFormData,
        });
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          submissionData.logoUrl = uploadData.url;
        }
      }
      
      // Also include standard fields if they exist (for backward compatibility)
      if (formData.email) submissionData.email = formData.email;
      if (formData.password) submissionData.password = formData.password;
      if (formData.fullName) submissionData.fullName = formData.fullName;
      if (formData.phone) submissionData.phone = formData.phone;
      if (formData.location) submissionData.location = formData.location;
      if (formData.companyName) submissionData.companyName = formData.companyName;
      if (formData.website) submissionData.website = formData.website;
      if (formData.companyDescription) submissionData.companyDescription = formData.companyDescription;

      // Register employer
      const response = await fetch('/api/employers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! You can now sign in.');
        window.location.href = '/';
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
                    else if ((captionLower.includes('full name') || captionLower.includes('name')) && !mappedValue) mappedValue = formData.fullName;
                    else if (captionLower.includes('phone') && !mappedValue) mappedValue = formData.phone;
                    else if (captionLower.includes('location') && !mappedValue) mappedValue = formData.location;
                    else if (captionLower.includes('password') && !mappedValue) mappedValue = formData.password;
                    else if ((captionLower.includes('company') || captionLower.includes('company name')) && !mappedValue) mappedValue = formData.companyName;
                    else if (captionLower.includes('website') && !mappedValue) mappedValue = formData.website;
                    
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
                          else if (captionLower.includes('full name') || captionLower.includes('name')) setFormData(prev => ({ ...prev, fullName: value }));
                          else if (captionLower.includes('phone')) setFormData(prev => ({ ...prev, phone: value }));
                          else if (captionLower.includes('location')) setFormData(prev => ({ ...prev, location: value }));
                          else if (captionLower.includes('password')) setFormData(prev => ({ ...prev, password: value }));
                          else if (captionLower.includes('company') || captionLower.includes('company name')) setFormData(prev => ({ ...prev, companyName: value }));
                          else if (captionLower.includes('website')) setFormData(prev => ({ ...prev, website: value }));
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
          </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
