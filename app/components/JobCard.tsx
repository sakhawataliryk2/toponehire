interface JobCardProps {
  date: string;
  title: string;
  description: string;
  company: string;
  location: string;
}

export default function JobCard({ date, title, description, company, location }: JobCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3 flex-shrink-0">
              <span className="text-[10px]">Complete</span>
            </div>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-3">{title}</h4>
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">{description}</p>
          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600">
            <span className="font-semibold uppercase">{company}</span>
            <span className="hidden sm:inline mx-2">•</span>
            <span className="uppercase">{location}</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-yellow-500 ml-4 flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
