'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DynamicFormField from '../components/DynamicFormField';

interface WorkExperience {
  position: string;
  company: string;
  from: string;
  to: string;
  present: boolean;
  description: string;
}

interface Education {
  degree: string;
  institution: string;
  from: string;
  to: string;
  present: boolean;
}

interface CustomField {
  id: string;
  caption: string;
  type: string;
  required: boolean;
  placeholder?: string | null;
  helpText?: string | null;
  options?: string | null;
}

function CreateResumePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingType = searchParams.get('listing_type_id');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [jobSeeker, setJobSeeker] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileUrl, setResumeFileUrl] = useState<string>('');
  const personalSummaryRef = useRef<HTMLDivElement>(null);
  const workExpDescRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);

  const [formData, setFormData] = useState<Record<string, any>>({
    desiredJobTitle: '',
    jobType: '',
    categories: '',
    personalSummary: '',
    location: '',
    phone: '',
    letEmployersFind: true,
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    { position: '', company: '', from: '', to: '', present: false, description: '' },
  ]);

  const [educations, setEducations] = useState<Education[]>([
    { degree: '', institution: '', from: '', to: '', present: false },
  ]);

  useEffect(() => {
    const auth = localStorage.getItem('jobSeekerAuth');
    const jobSeekerData = localStorage.getItem('jobSeekerUser');

    if (!auth || !jobSeekerData) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      const user = JSON.parse(jobSeekerData);
      setJobSeeker(user);
      setFormData((prev) => ({
        ...prev,
        phone: user.phone || '',
        location: user.location || '',
      }));
    }
  }, [router]);

  // Fetch custom fields for RESUME context
  useEffect(() => {
    async function fetchCustomFields() {
      try {
        const res = await fetch('/api/custom-fields?context=RESUME');
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
    if (isAuthenticated && listingType === 'Resume') {
      fetchCustomFields();
    }
  }, [isAuthenticated, listingType]);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isCategoriesOpen && !target.closest('.categories-dropdown')) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoriesOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [`customField_${fieldId}`]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      // Upload file to Supabase storage (optional - won't block form submission)
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'resumes');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            setResumeFileUrl(data.url);
          }
        } else {
          // File upload failed, but that's okay - resume can be created without file
          console.warn('File upload failed, but resume can still be created without file');
          setResumeFileUrl(''); // Clear the URL so we don't save an invalid one
        }
      } catch (error) {
        // File upload failed, but that's okay - resume can be created without file
        console.warn('File upload error (non-blocking):', error);
        setResumeFileUrl(''); // Clear the URL so we don't save an invalid one
      }
    } else {
      setResumeFile(null);
      setResumeFileUrl('');
    }
  };

  const handleEditorInput = (ref: React.RefObject<HTMLDivElement | null>, field: string) => {
    if (ref.current) {
      setFormData((prev) => ({ ...prev, [field]: ref.current!.innerHTML }));
    }
  };

  const handleWorkExpDescInput = (index: number) => {
    const ref = workExpDescRefs.current[index];
    if (ref) {
      const newWorkExps = [...workExperiences];
      newWorkExps[index].description = ref.innerHTML;
      setWorkExperiences(newWorkExps);
    }
  };

  const applyFormat = (command: string, value?: string, ref?: React.RefObject<HTMLDivElement | null> | HTMLDivElement | null) => {
    let targetElement: HTMLDivElement | null = null;
    
    if (ref) {
      // Handle both RefObject and direct element
      if ('current' in ref) {
        targetElement = ref.current;
      } else {
        targetElement = ref;
      }
    } else {
      targetElement = personalSummaryRef.current;
    }
    
    if (targetElement) {
      targetElement.focus();
      document.execCommand(command, false, value);
      
      if (ref && !('current' in ref)) {
        // Direct element passed - find the index
        const index = workExperiences.findIndex((_, i) => workExpDescRefs.current[i] === targetElement);
        if (index !== -1) {
          handleWorkExpDescInput(index);
        }
      } else if (ref && 'current' in ref) {
        // RefObject passed
        handleWorkExpDescInput(workExperiences.findIndex((_, i) => workExpDescRefs.current[i] === ref.current));
      } else {
        handleEditorInput(personalSummaryRef, 'personalSummary');
      }
    }
  };

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, { position: '', company: '', from: '', to: '', present: false, description: '' }]);
  };

  const removeWorkExperience = (index: number) => {
    if (workExperiences.length > 1) {
      const newWorkExps = workExperiences.filter((_, i) => i !== index);
      setWorkExperiences(newWorkExps);
    }
  };

  const handleWorkExpChange = (index: number, field: keyof WorkExperience, value: string | boolean) => {
    const newWorkExps = [...workExperiences];
    (newWorkExps[index] as any)[field] = value;
    setWorkExperiences(newWorkExps);
  };

  const addEducation = () => {
    setEducations([...educations, { degree: '', institution: '', from: '', to: '', present: false }]);
  };

  const removeEducation = (index: number) => {
    if (educations.length > 1) {
      const newEducations = educations.filter((_, i) => i !== index);
      setEducations(newEducations);
    }
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string | boolean) => {
    const newEducations = [...educations];
    (newEducations[index] as any)[field] = value;
    setEducations(newEducations);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
            fileFormData.append('folder', 'resumes');
            
            const uploadResponse = await fetch('/api/upload', {
              method: 'POST',
              body: fileFormData,
            });
            
            if (uploadResponse.ok) {
              const uploadData = await uploadResponse.json();
              submissionData[fieldKey] = uploadData.url;
            } else {
              throw new Error(`Failed to upload ${field.caption}`);
            }
          })();
          fileUploadPromises.push(uploadPromise);
        } else {
          // Regular field value
          submissionData[fieldKey] = value;
        }
      }
      
      // Wait for all file uploads to complete
      await Promise.all(fileUploadPromises);
      
      // Handle legacy resume file upload if it exists
      if (resumeFile && resumeFileUrl) {
        submissionData.resumeFileUrl = resumeFileUrl;
      }
      
      // Extract standard fields from custom field values (map by caption)
      let desiredJobTitle = '';
      let jobType = '';
      let categories = '';
      let personalSummary = '';
      let location = '';
      let phone = '';
      let letEmployersFind = true;

      for (const field of customFields) {
        const fieldKey = `customField_${field.id}`;
        const value = submissionData[fieldKey] || formData[fieldKey];
        const captionLower = field.caption.toLowerCase();

        if (captionLower.includes('desired') && captionLower.includes('job') && captionLower.includes('title')) desiredJobTitle = String(value || '');
        else if (captionLower.includes('job') && captionLower.includes('type')) jobType = String(value || '');
        else if (captionLower.includes('categor')) categories = String(value || '');
        else if (captionLower.includes('personal') && captionLower.includes('summary')) personalSummary = String(value || '');
        else if (captionLower.includes('location')) location = String(value || '');
        else if (captionLower.includes('phone')) phone = String(value || '');
        else if (captionLower.includes('employer') && captionLower.includes('find')) letEmployersFind = Boolean(value);
      }

      // Also check direct field names in formData (for backward compatibility)
      desiredJobTitle = desiredJobTitle || formData.desiredJobTitle || '';
      jobType = jobType || formData.jobType || '';
      categories = categories || formData.categories || '';
      personalSummary = personalSummary || formData.personalSummary || '';
      location = location || formData.location || '';
      phone = phone || formData.phone || '';
      letEmployersFind = formData.letEmployersFind !== undefined ? formData.letEmployersFind : true;

      // Include all custom field values
      Object.keys(formData).forEach(key => {
        if (key.startsWith('customField_')) {
          submissionData[key] = formData[key];
        }
      });

      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobSeekerId: jobSeeker.id,
          resumeFileUrl: resumeFileUrl || null,
          desiredJobTitle,
          jobType,
          categories,
          personalSummary,
          location,
          phone,
          letEmployersFind,
          // Work Experience and Education are now optional - only include if custom fields exist for them
          ...(workExperiences.length > 0 && workExperiences[0].position ? { workExperience: workExperiences } : {}),
          ...(educations.length > 0 && educations[0].degree ? { education: educations } : {}),
          ...submissionData, // Include all custom field values
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to success page with resume ID
        router.push(`/manage-listing?id=${data.resume.id}`);
      } else {
        // Show detailed error message
        const errorMsg = data.details || data.error || 'Failed to create resume';
        alert(`Error: ${errorMsg}${data.details ? `\n\nDetails: ${data.details}` : ''}`);
        console.error('Resume creation error:', data);
      }
    } catch (error) {
      console.error('Error creating resume:', error);
      alert('An error occurred while creating the resume');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (listingType !== 'Resume') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
          <p className="text-gray-600">Invalid listing type</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'serif' }}>
          Create New Resume
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {loadingFields ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading form fields...</p>
            </div>
          ) : (
            <>
              {/* Dynamic Custom Fields */}
              {customFields.length > 0 && (
                <div className="space-y-6">
                  {customFields.map((field) => {
                    const fieldKey = `customField_${field.id}`;
                    // Map standard fields if custom fields match
                    let mappedValue = formData[fieldKey];
                    const captionLower = field.caption.toLowerCase();
                    
                    // Map to standard fields if they match
                    if (captionLower.includes('desired') && captionLower.includes('job') && captionLower.includes('title') && !mappedValue) mappedValue = formData.desiredJobTitle;
                    else if (captionLower.includes('job') && captionLower.includes('type') && !mappedValue) mappedValue = formData.jobType;
                    else if (captionLower.includes('categor') && !mappedValue) mappedValue = formData.categories;
                    else if (captionLower.includes('personal') && captionLower.includes('summary') && !mappedValue) mappedValue = formData.personalSummary;
                    else if (captionLower.includes('location') && !mappedValue) mappedValue = formData.location;
                    else if (captionLower.includes('phone') && !mappedValue) mappedValue = formData.phone;
                    
                    return (
                      <DynamicFormField
                        key={field.id}
                        field={field}
                        value={mappedValue}
                        onChange={(value) => {
                          handleCustomFieldChange(field.id, value);
                          // Also update standard fields if they match
                          const captionLower = field.caption.toLowerCase();
                          if (captionLower.includes('desired') && captionLower.includes('job') && captionLower.includes('title')) setFormData(prev => ({ ...prev, desiredJobTitle: value }));
                          else if (captionLower.includes('job') && captionLower.includes('type')) setFormData(prev => ({ ...prev, jobType: value }));
                          else if (captionLower.includes('categor')) setFormData(prev => ({ ...prev, categories: value }));
                          else if (captionLower.includes('personal') && captionLower.includes('summary')) setFormData(prev => ({ ...prev, personalSummary: value }));
                          else if (captionLower.includes('location')) setFormData(prev => ({ ...prev, location: value }));
                          else if (captionLower.includes('phone')) setFormData(prev => ({ ...prev, phone: value }));
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Message when no custom fields are configured */}
              {customFields.length === 0 && !loadingFields && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-lg mb-2">No resume fields have been configured yet.</p>
                  <p className="text-gray-500 text-sm">Please contact an administrator to set up the resume form fields.</p>
                </div>
              )}
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'POSTING...' : 'POST'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default function CreateResumePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <CreateResumePageContent />
    </Suspense>
  );
}
