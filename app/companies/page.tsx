import Header from '../components/Header';
import Footer from '../components/Footer';
import CompanySearchBar from '../components/CompanySearchBar';
import CompaniesList, { type CompanyListItem } from '../components/CompaniesList';
import FeaturedCompaniesSidebar from '../components/FeaturedCompaniesSidebar';
import { prisma } from '../../lib/prisma';

function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 3).map((p) => p[0]?.toUpperCase() ?? '').join('');
  return initials || name[0]?.toUpperCase() || '';
}

export default async function CompaniesPage() {
  // Fetch all employers
  const employers = await prisma.employer.findMany({
    select: {
      id: true,
      companyName: true,
    },
    orderBy: {
      companyName: 'asc',
    },
  });

  const companyNames = employers
    .map((e) => e.companyName)
    .filter((name): name is string => !!name);

  // Group jobs by employer name to get job counts
  const jobGroups = await prisma.job.groupBy({
    by: ['employer'],
    _count: { _all: true },
    where: {
      employer: {
        in: companyNames,
      },
    },
  } as any);

  const jobCountMap = new Map<string, number>();
  for (const group of jobGroups as { employer: string; _count: { _all: number } }[]) {
    jobCountMap.set(group.employer.toLowerCase(), group._count._all);
  }

  const companies: CompanyListItem[] = employers.map((employer) => {
    const name = employer.companyName || '';
    const jobCount = jobCountMap.get(name.toLowerCase()) ?? 0;
    return {
      id: employer.id,
      name,
      jobCount,
      initials: getInitials(name),
    };
  });

  const totalCompanies = companies.length;

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
              <h2 className="text-3xl font-bold text-gray-900">
                {totalCompanies.toLocaleString()} COMPANIES
              </h2>
            </div>
            
            <CompaniesList companies={companies} />
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
