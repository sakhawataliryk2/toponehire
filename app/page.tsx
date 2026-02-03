import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturedCompanies from './components/FeaturedCompanies';
import JobListings from './components/JobListings';
import Sidebar from './components/Sidebar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header activePage="home" />
      <HeroSection />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <FeaturedCompanies />
            <JobListings />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
