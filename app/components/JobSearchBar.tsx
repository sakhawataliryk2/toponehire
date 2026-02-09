interface JobSearchBarProps {
  onKeywordChange?: (keyword: string) => void;
  onLocationChange?: (location: string) => void;
}

export default function JobSearchBar({ onKeywordChange, onLocationChange }: JobSearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by parent component via onChange
  };

  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Keywords"
              onChange={(e) => onKeywordChange?.(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Location"
              onChange={(e) => onLocationChange?.(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-3 rounded font-bold text-lg whitespace-nowrap"
          >
            FIND JOBS
          </button>
        </form>
      </div>
    </div>
  );
}
