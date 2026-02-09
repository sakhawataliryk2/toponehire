'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function ResumePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const resumeId = params?.id as string;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem('jobSeekerAuth');
    if (!auth) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      if (resumeId) {
        fetchResume();
      }
    }
  }, [resumeId, router]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resumes/${resumeId}`);
      const data = await response.json();
      if (data.resume) {
        setResume(data.resume);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
          <p className="text-gray-600">Loading resume...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
          <p className="text-gray-600">Resume not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const workExperiences = resume.workExperience ? JSON.parse(resume.workExperience) : [];
  const educations = resume.education ? JSON.parse(resume.education) : [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Resume Preview</h1>
            <Link
              href="/job-seeker/dashboard"
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded"
            >
              Edit Resume
            </Link>
          </div>

          {/* Resume Content */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{resume.desiredJobTitle}</h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>Job Type:</strong> {resume.jobType}</p>
                <p><strong>Category:</strong> {resume.categories}</p>
                <p><strong>Location:</strong> {resume.location}</p>
                <p><strong>Phone:</strong> {resume.phone}</p>
                {resume.resumeFileUrl && (
                  <p>
                    <strong>Resume File:</strong>{' '}
                    <a href={resume.resumeFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Resume PDF
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Personal Summary */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Summary</h3>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: resume.personalSummary }}
              />
            </div>

            {/* Work Experience */}
            {workExperiences.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Work Experience</h3>
                <div className="space-y-6">
                  {workExperiences.map((exp: any, index: number) => (
                    <div key={index} className="border-l-4 border-yellow-400 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {exp.from} - {exp.present ? 'Present' : exp.to}
                      </p>
                      {exp.description && (
                        <div
                          className="mt-2 prose prose-sm max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{ __html: exp.description }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Education</h3>
                <div className="space-y-4">
                  {educations.map((edu: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-4">
                      <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                      <p className="text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        {edu.from} - {edu.present ? 'Present' : edu.to}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
