'use client';

import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header activePage="my-account" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
            <p className="text-gray-700 mb-6">
              Your payment was cancelled. No charges were made to your account.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/employer-products"
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-colors"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
