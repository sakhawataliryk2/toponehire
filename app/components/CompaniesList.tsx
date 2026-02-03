import CompanyCard from './CompanyCard';

interface Company {
  name: string;
  jobCount: number;
  initials: string;
}

const companies: Company[] = [
  { name: '1840 & Company', jobCount: 4, initials: '1C' },
  { name: '1electric', jobCount: 1, initials: '1E' },
  { name: 'AAA Life Insurance Company', jobCount: 1, initials: 'AL' },
  { name: 'Aarris Healthcare', jobCount: 1, initials: 'AH' },
  { name: 'AB Spectrum', jobCount: 3, initials: 'AS' },
  { name: 'Abbott Laboratories', jobCount: 1, initials: 'AL' },
  { name: 'AbilityFirst', jobCount: 2, initials: 'AF' },
  { name: 'Accord Intermediate Holdings Inc', jobCount: 1, initials: 'AI' },
  { name: 'Accruity', jobCount: 1, initials: 'AC' },
  { name: 'AcreTrader Inc', jobCount: 1, initials: 'AT' },
  { name: 'ActiveCampaign LLC', jobCount: 1, initials: 'AC' },
  { name: 'Adi Developments', jobCount: 1, initials: 'AD' },
  { name: 'Complete Healthcare Staffing', jobCount: 74, initials: 'CHS' },
  { name: 'Complete Staffing Solutions', jobCount: 232, initials: 'CSS' },
  { name: 'Dana-Farber Cancer Institute', jobCount: 19, initials: 'DF' },
];

export default function CompaniesList() {
  return (
    <div>
      <div className="space-y-4">
        {companies.map((company, index) => (
          <CompanyCard
            key={index}
            name={company.name}
            jobCount={company.jobCount}
            initials={company.initials}
          />
        ))}
      </div>
      
      {/* Load More Button */}
      <div className="mt-8 text-center">
        <button className="bg-gray-100 hover:bg-gray-200 text-orange-500 font-semibold px-8 py-3 rounded-lg text-lg transition-colors">
          LOAD MORE
        </button>
      </div>
    </div>
  );
}
