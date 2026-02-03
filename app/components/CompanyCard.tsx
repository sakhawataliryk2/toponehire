interface CompanyCardProps {
  name: string;
  jobCount: number;
  initials: string;
}

export default function CompanyCard({ name, jobCount, initials }: CompanyCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-4">
      <div className="flex items-center">
        {/* Company Initials Box */}
        <div className="w-16 h-16 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
          <span className="text-yellow-600 font-bold text-lg">{initials}</span>
        </div>
        
        {/* Company Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{name}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{jobCount} JOB(S)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
