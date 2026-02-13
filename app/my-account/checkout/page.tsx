'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employer, setEmployer] = useState<any>(null);

  useEffect(() => {
    const auth = localStorage.getItem('employerAuth');
    const employerData = localStorage.getItem('employerUser');

    if (!auth || !employerData) {
      router.push(`/login?redirect=/my-account/checkout?product=${productId}`);
      return;
    }

    setEmployer(JSON.parse(employerData));
    setLoading(false);
  }, [router, productId]);

  useEffect(() => {
    if (!loading && employer && productId) {
      handleCheckout();
    }
  }, [loading, employer, productId]);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          employerId: employer.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout session');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header activePage="my-account" />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
            <p className="text-gray-600">Redirecting to secure checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header activePage="my-account" />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-900 mb-2">Checkout Error</h2>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => router.push('/employer-products')}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return null;
}
