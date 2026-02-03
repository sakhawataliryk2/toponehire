import Header from '../components/Header';
import Footer from '../components/Footer';
import CompanySearchBar from '../components/CompanySearchBar';
import CompaniesList from '../components/CompaniesList';
import FeaturedCompaniesSidebar from '../components/FeaturedCompaniesSidebar';

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header activePage="companies" />
      <CompanySearchBar />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Listings */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900">1,336 COMPANIES</h2>
            </div>
            
            <CompaniesList />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <FeaturedCompaniesSidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
