'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  billingInterval: 'MONTHLY' | 'YEARLY';
  firstMonthFree: boolean;
  postJobs: boolean;
  featuredEmployer: boolean;
  resumeAccess: boolean;
}

export default function EmployerProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?type=EMPLOYER');
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePostJob = () => {
    // Check if employer is logged in
    const auth = localStorage.getItem('employerAuth');
    if (auth) {
      router.push('/my-account/job-postings');
    } else {
      // If not logged in, redirect to login first
      router.push('/login?redirect=/my-account/job-postings');
    }
  };

  const handleBuy = (productId: string) => {
    // Check if employer is logged in
    const auth = localStorage.getItem('employerAuth');
    if (auth) {
      // TODO: Implement purchase flow
      router.push(`/my-account/checkout?product=${productId}`);
    } else {
      // If not logged in, redirect to login first
      router.push(`/login?redirect=/my-account/checkout?product=${productId}`);
    }
  };

  const formatPrice = (price: number, interval: 'MONTHLY' | 'YEARLY') => {
    const formattedPrice = price.toFixed(2);
    const intervalText = interval === 'MONTHLY' ? 'per month' : 'per year';
    return `$${formattedPrice} ${intervalText}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header activePage="employer-products" />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-16">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-lg text-gray-600 mb-6">Choose the plan that works best for your hiring needs</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products available at the moment.</p>
            <p className="text-sm text-gray-500">Please check back later or contact support.</p>
          </div>
        ) : (
          /* Pricing Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {products.map((product) => (
              <div key={product.id} className="bg-white border-2 border-yellow-300 rounded-lg p-8 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h3>
                  {product.description && (
                    <div 
                      className="text-gray-700 mb-4 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  )}
                  <div className="space-y-2 text-sm text-gray-700">
                    {product.postJobs && (
                      <p className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Post Jobs
                      </p>
                    )}
                    {product.featuredEmployer && (
                      <p className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Featured Employer
                      </p>
                    )}
                    {product.resumeAccess && (
                      <p className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Resume Database Access
                      </p>
                    )}
                    {product.firstMonthFree && (
                      <p className="flex items-center text-yellow-600 font-medium">
                        <span className="mr-2">🎁</span>
                        First Month Free
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-8">
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {formatPrice(product.price, product.billingInterval)}
                  </p>
                  {product.billingInterval === 'MONTHLY' && (
                    <p className="text-sm text-gray-500 mb-6">Recurring (per month)</p>
                  )}
                  <button
                    onClick={() => handleBuy(product.id)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded border border-yellow-500 transition-colors"
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
