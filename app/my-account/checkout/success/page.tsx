'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // Verify payment and activate plan
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) {
            setOrder(data.order);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-white">
      <Header activePage="my-account" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
              <p className="text-gray-600">Processing your payment...</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
              <p className="text-gray-700 mb-6">
                Your plan has been activated successfully. You can now start using all the features included in your plan.
              </p>
              {order && (
                <div className="bg-white rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-gray-600">Order Number:</p>
                  <p className="font-medium text-gray-900">{order.invoiceNumber}</p>
                </div>
              )}
              <div className="flex gap-4 justify-center">
                <Link
                  href="/my-account"
                  className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition-colors"
                >
                  Go to My Account
                </Link>
                <Link
                  href="/my-account/job-postings"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                >
                  Post a Job
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
