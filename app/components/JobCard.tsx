import Link from 'next/link';

interface JobCardProps {
  jobId: string;
  date: string;
  title: string;
  description: string;
  company: string;
  location: string;
  /** When set (job seeker logged in), show bookmark and allow save/unsave */
  isSaved?: boolean;
  /** True while save/unsave request is in flight - button disabled, icon only reflects server state */
  saving?: boolean;
  onSaveToggle?: (jobId: string, save: boolean) => void;
}

export default function JobCard({ jobId, date, title, description, company, location, isSaved, saving, onSaveToggle }: JobCardProps) {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saving) return;
    onSaveToggle?.(jobId, !isSaved);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow mb-4">
      <div className="flex justify-between items-start">
        <Link href={`/jobs/${jobId}`} className="flex-1 min-w-0 pr-3 cursor-pointer">
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
        </Link>
        {onSaveToggle != null ? (
          <button
            type="button"
            onClick={handleBookmarkClick}
            disabled={saving}
            className={`flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded p-1 disabled:opacity-60 disabled:pointer-events-none ${
              isSaved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`}
            aria-label={saving ? 'Saving…' : isSaved ? 'Unsave job' : 'Save job'}
          >
            {saving ? (
              <span className="inline-block w-6 h-6 border-2 border-gray-400 border-t-yellow-500 rounded-full animate-spin" aria-hidden />
            ) : (
              <svg className="w-6 h-6" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>
        ) : (
          <div className="flex-shrink-0 text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
