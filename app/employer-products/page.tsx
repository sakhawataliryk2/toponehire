import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EmployerProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header activePage="employer-products" />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-16">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Pricing</h1>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Pricing Card 1 */}
          <div className="bg-white border-2 border-yellow-300 rounded-lg p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                1 Month Job Posting, Featured Jobs, Featured Company
              </h3>
              <p className="text-gray-700 mb-4">
                Unlimited job posts for 30 days
              </p>
              <p className="text-gray-700 mb-4">
                Recruiter Assistance
              </p>
              <p className="text-gray-700">
                Featured Jobs and Featured Company placement
              </p>
            </div>
            <div className="mt-8">
              <p className="text-3xl font-bold text-gray-900 mb-6">$299 per month</p>
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded border border-yellow-500 transition-colors">
                Buy
              </button>
            </div>
          </div>

          {/* Pricing Card 2 */}
          <div className="bg-white border-2 border-yellow-300 rounded-lg p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Resume Data Base- 1 Month
              </h3>
              <p className="text-gray-700 mb-4">
                TopOneHire's Resume Database Search is a powerful, user-friendly tool designed to streamline your talent acquisition process.
              </p>
              <p className="text-gray-700">
                Access resumes and direct contact information
              </p>
            </div>
            <div className="mt-8">
              <p className="text-3xl font-bold text-gray-900 mb-6">$199.99 per month</p>
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded border border-yellow-500 transition-colors">
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
