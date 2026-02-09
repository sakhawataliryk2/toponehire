'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import JobSearchBar from '../components/JobSearchBar';
import JobCard from '../components/JobCard';
import JobsSidebar from '../components/JobsSidebar';

interface Job {
  id: string;
  title: string;
  employer: string;
  jobDescription: string;
  location: string;
  postingDate: string;
  categories: string;
  jobType: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs?status=Active');
        const data = await response.json();
        if (data.jobs) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchKeyword) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          job.employer.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          job.jobDescription.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (searchLocation) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [searchKeyword, searchLocation, jobs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const stripHtml = (html: string) => {
    if (typeof window !== 'undefined') {
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }
    return html.replace(/<[^>]*>/g, '').substring(0, 300);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header activePage="jobs" />
      <JobSearchBar
        onKeywordChange={setSearchKeyword}
        onLocationChange={setSearchLocation}
      />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Listings */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {loading ? 'LOADING...' : `${filteredJobs.length.toLocaleString()} JOBS FOUND`}
              </h2>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No jobs found. Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    date={formatDate(job.postingDate)}
                    title={job.title}
                    description={stripHtml(job.jobDescription)}
                    company={job.employer.toUpperCase()}
                    location={job.location.toUpperCase()}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <JobsSidebar jobs={jobs} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
