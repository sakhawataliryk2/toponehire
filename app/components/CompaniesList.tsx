import CompanyCard from './CompanyCard';

export interface CompanyListItem {
  id: string;
  name: string;
  jobCount: number;
  initials: string;
}

interface CompaniesListProps {
  companies: CompanyListItem[];
}

export default function CompaniesList({ companies }: CompaniesListProps) {
  return (
    <div>
      <div className="space-y-4">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            name={company.name}
            jobCount={company.jobCount}
            initials={company.initials}
          />
        ))}
      </div>
    </div>
  );
}
