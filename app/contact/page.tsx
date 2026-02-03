import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header activePage="contact" />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
            
            {/* Logo */}
            <div className="mb-6">
              <Image
                src="/images/logo.jpg"
                alt="TopOneHire Logo"
                width={200}
                height={60}
                className="h-12 w-auto mx-auto"
              />
            </div>
            
            <p className="text-gray-700 text-lg mb-8">
              If you need additional Information please fill out the contact form below.
            </p>
          </div>

          {/* Support Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Job Seeker Support */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Seeker Support:</h3>
              <a 
                href="mailto:Information@toponehire.com" 
                className="text-yellow-500 hover:text-yellow-600 underline"
              >
                Information@toponehire.com
              </a>
            </div>

            {/* Employer Support */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Employer Support:</h3>
              <div className="space-y-2">
                <p className="text-gray-700">Phone: <a href="tel:+14012447790" className="text-gray-900 hover:text-yellow-500">(401) 244-7790</a></p>
                <p className="text-gray-700">
                  Email: <a 
                    href="mailto:Information@toponehire.com" 
                    className="text-yellow-500 hover:text-yellow-600 underline"
                  >
                    Information@toponehire.com
                  </a>
                </p>
                <a 
                  href="#" 
                  className="text-yellow-500 hover:text-yellow-600 underline inline-block mt-2"
                >
                  Schedule a Demo
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <form className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Comments:</label>
                <textarea
                  placeholder="Your message..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-12 rounded-lg text-lg transition-colors"
                >
                  SUBMIT
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
      </div>

      <Footer />
    </div>
  );
}
