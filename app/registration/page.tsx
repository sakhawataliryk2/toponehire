import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header activePage="registration" />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Create an account
            </h1>
            <p className="text-xl text-gray-700">
              Choose account type:
            </p>
          </div>

          {/* Account Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Employer Button */}
            <Link
              href="/registration/employer"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg p-8 shadow-lg transition-all hover:shadow-xl transform hover:scale-105 block"
            >
              <div className="flex flex-col items-center text-center">
                {/* Building/Company Icon */}
                <div className="mb-6">
                  <svg className="w-20 h-20 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Employer</h2>
              </div>
            </Link>

            {/* Job Seeker Button */}
            <Link
              href="/registration/job-seeker"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg p-8 shadow-lg transition-all hover:shadow-xl transform hover:scale-105 block"
            >
              <div className="flex flex-col items-center text-center">
                {/* Person Icon */}
                <div className="mb-6">
                  <svg className="w-20 h-20 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Job Seeker</h2>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
