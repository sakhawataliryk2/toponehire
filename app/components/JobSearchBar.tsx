export default function JobSearchBar() {
  return (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
        <form className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Keywords"
              className="w-full px-4 py-3 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Location"
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
