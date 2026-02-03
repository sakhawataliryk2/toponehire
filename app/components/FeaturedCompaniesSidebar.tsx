interface Company {
  id: string;
  name: string;
  jobCount: number;
  initials: string;
}

const featuredCompanies: Company[] = [
  { id: '1', name: 'Complete Healthcare Staffing', jobCount: 74, initials: 'CHS' },
  { id: '2', name: 'Complete Staffing Solutions', jobCount: 232, initials: 'CSS' },
  { id: '3', name: 'Dana-Farber Cancer Institute', jobCount: 19, initials: 'DF' },
];

export default function FeaturedCompaniesSidebar() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Featured Companies</h3>
      <div className="space-y-4">
        {featuredCompanies.map((company) => (
          <div
            key={company.id}
            className="flex items-center pb-4 border-b border-gray-200 last:border-b-0 last:pb-0"
          >
            <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm mr-3 flex-shrink-0">
              {company.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{company.name}</h4>
              <p className="text-gray-600 text-sm">{company.jobCount} job(s)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
