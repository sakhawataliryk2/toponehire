'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'employer' | 'job-seeker'>('employer');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const employerAuth = localStorage.getItem('employerAuth');
    const jobSeekerAuth = localStorage.getItem('jobSeekerAuth');
    
    if (employerAuth) {
      router.push('/my-account');
    } else if (jobSeekerAuth) {
      router.push('/job-seeker/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = userType === 'employer' 
        ? '/api/employers/login' 
        : '/api/job-seekers/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth data
        const authKey = userType === 'employer' ? 'employerAuth' : 'jobSeekerAuth';
        const userKey = userType === 'employer' ? 'employerUser' : 'jobSeekerUser';
        
        localStorage.setItem(authKey, 'true');
        localStorage.setItem(userKey, JSON.stringify(data.user));

        // Redirect based on user type
        if (userType === 'employer') {
          router.push('/my-account');
        } else {
          router.push('/job-seeker/dashboard');
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header activePage="login" />
      
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Sign in</h1>
          
          {/* User Type Toggle */}
          <div className="mb-6 flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => setUserType('employer')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                userType === 'employer'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Employer
            </button>
            <button
              type="button"
              onClick={() => setUserType('job-seeker')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                userType === 'job-seeker'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Job Seeker
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-gray-50"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Keep me signed in
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-yellow-500 hover:text-yellow-600">
                  Forgot Your Password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <Link href="/registration" className="text-yellow-500 hover:text-yellow-600 font-medium">
                Employer Registration
              </Link>
              {' | '}
              <Link href="/registration" className="text-yellow-500 hover:text-yellow-600 font-medium">
                Job Seeker Registration
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
