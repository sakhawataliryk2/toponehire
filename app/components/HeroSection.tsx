'use client';

import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [liveJobCount, setLiveJobCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/jobs?status=Active&countOnly=true')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.count === 'number') setLiveJobCount(data.count);
      })
      .catch(() => {});
  }, []);

  const countText =
    liveJobCount !== null
      ? `Search ${liveJobCount.toLocaleString()} live jobs`
      : 'Search live jobs';

  return (
    <section className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20">
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{countText}</h2>
          <p className="text-2xl md:text-3xl mb-8">
            Elevate your career with <span className="text-yellow-400">TopOneHire</span>
          </p>
          
          {/* Search Form */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <form className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Keywords"
                  className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded font-bold text-lg"
              >
                Find Jobs
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
