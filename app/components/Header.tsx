'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  activePage?: string;
}

export default function Header({ activePage = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white relative">
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" onClick={closeMobileMenu}>
              <Image
                src="/images/logo.jpg"
                alt="TopOneHire Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>
          
          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              href="/jobs" 
              className={`font-medium text-sm ${
                activePage === 'jobs' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              Jobs
            </Link>
            <Link 
              href="/companies" 
              className={`font-medium text-sm ${
                activePage === 'companies' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              Companies
            </Link>
            <Link href="#" className="text-gray-700 hover:text-yellow-500 font-medium text-sm">
              Post a Job
            </Link>
            <Link href="#" className="text-gray-700 hover:text-yellow-500 font-medium text-sm">
              Create/Post Your Resume
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium text-sm ${
                activePage === 'contact' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              Contact Us
            </Link>
            <Link 
              href="/employer-products" 
              className={`font-medium text-sm ${
                activePage === 'employer-products' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              Employer Products
            </Link>
          </nav>
          
          {/* Desktop Sign In/Sign Up (Right Side) */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/login" className={`font-medium text-sm ${activePage === 'login' ? 'text-gray-900 border-b-2 border-gray-900 pb-1' : 'text-gray-600 hover:text-gray-800'}`}>
              SIGN IN
            </Link>
            <Link href="/registration" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800 px-4 py-2 rounded border border-gray-400 font-medium text-sm">
              SIGN UP
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-700 hover:text-yellow-500 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Image
              src="/images/logo.jpg"
              alt="TopOneHire Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <button
              onClick={closeMobileMenu}
              className="p-2 text-gray-700 hover:text-yellow-500"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-4">
              <Link
                href="/jobs"
                onClick={closeMobileMenu}
                className={`block py-3 px-4 rounded-lg font-medium text-sm ${
                  activePage === 'jobs'
                    ? 'bg-yellow-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Jobs
              </Link>
              <Link
                href="/companies"
                onClick={closeMobileMenu}
                className={`block py-3 px-4 rounded-lg font-medium text-sm ${
                  activePage === 'companies'
                    ? 'bg-yellow-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Companies
              </Link>
              <Link
                href="#"
                onClick={closeMobileMenu}
                className="block py-3 px-4 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100"
              >
                Post a Job
              </Link>
              <Link
                href="#"
                onClick={closeMobileMenu}
                className="block py-3 px-4 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100"
              >
                Create/Post Your Resume
              </Link>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className={`block py-3 px-4 rounded-lg font-medium text-sm ${
                  activePage === 'contact'
                    ? 'bg-yellow-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Contact Us
              </Link>
              <Link
                href="/employer-products"
                onClick={closeMobileMenu}
                className={`block py-3 px-4 rounded-lg font-medium text-sm ${
                  activePage === 'employer-products'
                    ? 'bg-yellow-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Employer Products
              </Link>
            </div>
          </nav>

          {/* Mobile Sign In/Sign Up */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="block text-center text-gray-600 hover:text-gray-800 font-medium text-sm py-2"
            >
              SIGN IN
            </Link>
            <Link
              href="/registration"
              onClick={closeMobileMenu}
              className="block text-center bg-yellow-400 hover:bg-yellow-500 text-yellow-800 px-4 py-2 rounded border border-gray-400 font-medium text-sm"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
}
