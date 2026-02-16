'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface JobSeekerUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  location?: string | null;
}

export default function AccountSettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<JobSeekerUser | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('jobSeekerAuth');
    const userStr = localStorage.getItem('jobSeekerUser');
    if (!auth || !userStr) {
      router.push('/login');
      return;
    }
    try {
      const u = JSON.parse(userStr);
      setUser(u);
      setFirstName(u.firstName ?? '');
      setLastName(u.lastName ?? '');
      setPhone(u.phone ?? '');
      setLocation(u.location ?? '');
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileSubmitting(true);
    setProfileMessage(null);
    try {
      const res = await fetch(`/api/job-seekers/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, phone: phone || null, location: location || null }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.jobSeeker);
        localStorage.setItem('jobSeekerUser', JSON.stringify(data.jobSeeker));
        setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setProfileMessage({ type: 'error', text: data.error || 'Failed to update profile.' });
      }
    } catch {
      setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    setPasswordSubmitting(true);
    try {
      const res = await fetch(`/api/job-seekers/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password.' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Failed to change password.' });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'serif' }}>
            My Account
          </h1>

          {/* Tabs Navigation */}
          <div className="flex justify-center border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              <Link
                href="/my-listings/resume"
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                My Resumes
              </Link>
              <Link
                href="/my-listings/applications"
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                My Applications
              </Link>
              <Link
                href="/my-listings/saved-jobs"
                className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors"
              >
                Saved Jobs
              </Link>
              <Link
                href="/my-listings/account-settings"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  pathname === '/my-listings/account-settings'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Account Settings
              </Link>
            </nav>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-8">
            {/* Profile / credentials */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile &amp; credentials</h2>
              <form onSubmit={handleProfileSubmit} className="max-w-xl space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email ?? ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                {profileMessage && (
                  <p className={`text-sm ${profileMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {profileMessage.text}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 font-medium disabled:opacity-50"
                >
                  {profileSubmitting ? 'Saving...' : 'Save profile'}
                </button>
              </form>
            </section>

            <hr className="border-gray-200" />

            {/* Change password */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Change password</h2>
              <form onSubmit={handlePasswordSubmit} className="max-w-xl space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    autoComplete="new-password"
                  />
                </div>
                {passwordMessage && (
                  <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordMessage.text}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-medium disabled:opacity-50"
                >
                  {passwordSubmitting ? 'Updating...' : 'Change password'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
