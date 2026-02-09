'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

  const [formData, setFormData] = useState({
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
      // Validate required fields
      if (!formData.desiredJobTitle || !formData.jobType || selectedCategories.length === 0 || !formData.personalSummary || !formData.location || !formData.phone) {
        alert('Please fill in all required fields, including at least one category');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobSeekerId: jobSeeker.id,
          resumeFileUrl: resumeFileUrl || null, // Make sure it's null if empty string
          desiredJobTitle: formData.desiredJobTitle,
          jobType: formData.jobType,
          categories: formData.categories,
          personalSummary: formData.personalSummary,
          location: formData.location,
          phone: formData.phone,
          letEmployersFind: formData.letEmployersFind,
          workExperience: workExperiences,
          education: educations,
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
          {/* Upload Resume */}
          <div>
            <label htmlFor="resumeFile" className="block text-gray-700 font-medium mb-2">
              Upload Resume <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="resumeFile"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {resumeFile && <p className="text-sm text-gray-600 mt-1">Selected: {resumeFile.name}</p>}
          </div>

          {/* Desired Job Title */}
          <div>
            <label htmlFor="desiredJobTitle" className="block text-gray-700 font-medium mb-2">
              Desired Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="desiredJobTitle"
              name="desiredJobTitle"
              value={formData.desiredJobTitle}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Job Type and Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="jobType" className="block text-gray-700 font-medium mb-2">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Job Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="relative categories-dropdown">
              <label htmlFor="categories" className="block text-gray-700 font-medium mb-2">
                Categories <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                >
                  <span className={selectedCategories.length === 0 ? 'text-gray-400' : 'text-gray-900'}>
                    {selectedCategories.length === 0
                      ? 'Click To Select'
                      : selectedCategories.join(', ')}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isCategoriesOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isCategoriesOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {[
                      'Accounting',
                      'Admin-Clerical',
                      'Automotive',
                      'Banking',
                      'Biotech',
                      'Business Development',
                      'Caregiving',
                      'Construction',
                      'Consultant',
                      'Customer Service',
                      'Design',
                      'Education',
                      'Energy',
                      'Engineering',
                      'Entertainment',
                      'Executive',
                      'Finance',
                      'Food Service',
                      'Healthcare',
                      'Hospitality',
                      'Human Resources',
                      'Information Technology',
                      'Insurance',
                      'Legal',
                      'Management',
                      'Manufacturing',
                      'Marketing',
                      'Media',
                      'Nurse',
                      'Operations',
                      'Other',
                      'Real Estate',
                      'Retail',
                      'Sales',
                      'Science',
                      'Security',
                      'Skilled Labor',
                      'Social Services',
                      'Transportation',
                      'Warehouse',
                    ].map((category) => (
                      <label
                        key={category}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newCategories = [...selectedCategories, category];
                              setSelectedCategories(newCategories);
                              setFormData((prev) => ({
                                ...prev,
                                categories: newCategories.join(', '),
                              }));
                            } else {
                              const newCategories = selectedCategories.filter((c) => c !== category);
                              setSelectedCategories(newCategories);
                              setFormData((prev) => ({
                                ...prev,
                                categories: newCategories.join(', '),
                              }));
                            }
                          }}
                          className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {selectedCategories.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected
                </p>
              )}
            </div>
          </div>

          {/* Personal Summary */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Personal Summary <span className="text-red-500">*</span>
            </label>
            {/* Rich Text Editor Toolbar */}
            <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => applyFormat('bold')}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm font-bold text-gray-700"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => applyFormat('italic')}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm italic text-gray-700"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => applyFormat('underline')}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm underline text-gray-700"
                title="Underline"
              >
                U
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Enter URL:');
                  if (url) applyFormat('createLink', url);
                }}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                title="Insert Link"
              >
                🔗
              </button>
              <button
                type="button"
                onClick={() => applyFormat('insertUnorderedList')}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                title="Bullet List"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => applyFormat('insertOrderedList')}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                title="Numbered List"
              >
                1.
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button
                type="button"
                onClick={() => applyFormat('justifyLeft')}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                title="Align Left"
              >
                ⬅
              </button>
              <button
                type="button"
                onClick={() => applyFormat('justifyCenter')}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                title="Align Center"
              >
                ⬌
              </button>
              <button
                type="button"
                onClick={() => applyFormat('justifyRight')}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                title="Align Right"
              >
                ➡
              </button>
              <button
                type="button"
                onClick={() => applyFormat('justifyFull')}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                title="Justify"
              >
                ⬌⬌
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Enter image URL:');
                  if (url) {
                    document.execCommand('insertImage', false, url);
                    handleEditorInput(personalSummaryRef, 'personalSummary');
                  }
                }}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                title="Insert Image"
              >
                🖼️
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Enter video URL:');
                  if (url) {
                    const iframe = `<iframe src="${url}" width="560" height="315"></iframe>`;
                    document.execCommand('insertHTML', false, iframe);
                    handleEditorInput(personalSummaryRef, 'personalSummary');
                  }
                }}
                className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                title="Insert Video"
              >
                ▶️
              </button>
            </div>
            {/* Rich Text Editor Content */}
            <div
              ref={personalSummaryRef}
              contentEditable
              onInput={() => handleEditorInput(personalSummaryRef, 'personalSummary')}
              className="w-full min-h-[200px] px-4 py-3 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>

          {/* Location and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Let Employers Find My Resume */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="letEmployersFind"
                checked={formData.letEmployersFind}
                onChange={handleInputChange}
                className="mr-2 w-4 h-4"
              />
              <span className="text-gray-700 font-medium">Let Employers Find My Resume <span className="text-red-500">*</span></span>
            </label>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Work Experience <span className="text-red-500">*</span>
            </h2>
            {workExperiences.map((workExp, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Experience {index + 1}</h3>
                  <div className="flex gap-2">
                    {workExperiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkExperience(index)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      >
                        Remove
                      </button>
                    )}
                    {index === workExperiences.length - 1 && (
                      <button
                        type="button"
                        onClick={addWorkExperience}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                      >
                        + Add Work Experience
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Position</label>
                    <input
                      type="text"
                      value={workExp.position}
                      onChange={(e) => handleWorkExpChange(index, 'position', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Company</label>
                    <input
                      type="text"
                      value={workExp.company}
                      onChange={(e) => handleWorkExpChange(index, 'company', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">From</label>
                    <input
                      type="date"
                      value={workExp.from}
                      onChange={(e) => handleWorkExpChange(index, 'from', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">To</label>
                    <input
                      type="date"
                      value={workExp.to}
                      onChange={(e) => handleWorkExpChange(index, 'to', e.target.value)}
                      disabled={workExp.present}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    <label className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={workExp.present}
                        onChange={(e) => handleWorkExpChange(index, 'present', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Present</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  {/* Rich Text Editor Toolbar for Description */}
                  <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center gap-1 flex-wrap mb-0">
                    <button
                      type="button"
                      onClick={() => applyFormat('bold', undefined, workExpDescRefs.current[index])}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm font-bold text-gray-700"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('italic', undefined, workExpDescRefs.current[index])}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm italic text-gray-700"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('underline', undefined, workExpDescRefs.current[index])}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm underline text-gray-700"
                      title="Underline"
                    >
                      U
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Enter URL:');
                        if (url) applyFormat('createLink', url, workExpDescRefs.current[index]);
                      }}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Insert Link"
                    >
                      🔗
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('insertUnorderedList', undefined, workExpDescRefs.current[index])}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Bullet List"
                    >
                      •
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('insertOrderedList', undefined, workExpDescRefs.current[index])}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Numbered List"
                    >
                      1.
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => applyFormat('justifyLeft', undefined, workExpDescRefs.current[index])}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Align Left"
                    >
                      ⬅
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('justifyCenter', undefined, workExpDescRefs.current[index])}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Align Center"
                    >
                      ⬌
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('justifyRight', undefined, workExpDescRefs.current[index])}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Align Right"
                    >
                      ➡
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormat('justifyFull', undefined, workExpDescRefs.current[index])}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Justify"
                    >
                      ⬌⬌
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Enter image URL:');
                        if (url) {
                          document.execCommand('insertImage', false, url);
                          handleWorkExpDescInput(index);
                        }
                      }}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Insert Image"
                    >
                      🖼️
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Enter video URL:');
                        if (url) {
                          const iframe = `<iframe src="${url}" width="560" height="315"></iframe>`;
                          document.execCommand('insertHTML', false, iframe);
                          handleWorkExpDescInput(index);
                        }
                      }}
                      className="px-3 py-1.5 hover:bg-gray-200 rounded text-sm"
                      title="Insert Video"
                    >
                      ▶️
                    </button>
                  </div>
                  {/* Rich Text Editor Content */}
                  <div
                    ref={(el) => { workExpDescRefs.current[index] = el; }}
                    contentEditable
                    onInput={() => handleWorkExpDescInput(index)}
                    className="w-full min-h-[150px] px-4 py-3 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ whiteSpace: 'pre-wrap' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Education <span className="text-red-500">*</span>
            </h2>
            {educations.map((edu, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Education {index + 1}</h3>
                  <div className="flex gap-2">
                    {educations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                      >
                        Remove
                      </button>
                    )}
                    {index === educations.length - 1 && (
                      <button
                        type="button"
                        onClick={addEducation}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                      >
                        + Add Education
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Degree or Specialty</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">University or Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">From</label>
                    <input
                      type="date"
                      value={edu.from}
                      onChange={(e) => handleEducationChange(index, 'from', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">To</label>
                    <input
                      type="date"
                      value={edu.to}
                      onChange={(e) => handleEducationChange(index, 'to', e.target.value)}
                      disabled={edu.present}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                    <label className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={edu.present}
                        onChange={(e) => handleEducationChange(index, 'present', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Present</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
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
