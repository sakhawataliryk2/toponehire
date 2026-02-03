interface Company {
  id: string;
  name: string;
  jobCount: number;
  initials: string;
}

const companies: Company[] = [
  { id: '1', name: 'Complete Staffing Solutions', jobCount: 232, initials: 'CSS' },
  { id: '2', name: 'Dana-Farber Cancer Institute', jobCount: 19, initials: 'DF' },
  { id: '3', name: 'Complete Healthcare Staffing', jobCount: 74, initials: 'CHS' },
];

export default function FeaturedCompanies() {
  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Companies</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xl mr-4">
                {company.initials}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{company.name}</h4>
                <p className="text-gray-600 text-sm">{company.jobCount} job(s)</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
