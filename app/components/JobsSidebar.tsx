interface JobsSidebarProps {
  jobs?: any[];
}

export default function JobsSidebar({ jobs = [] }: JobsSidebarProps) {
  // Calculate real category counts from jobs
  const categoryCounts: { [key: string]: number } = {};
  const jobTypeCounts: { [key: string]: number } = {};
  let onsiteCount = 0;

  jobs.forEach((job) => {
    // Count categories (categories are comma-separated)
    if (job.categories) {
      const cats = job.categories.split(',').map((c: string) => c.trim());
      cats.forEach((cat: string) => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
    }

    // Count job types
    if (job.jobType) {
      const type = job.jobType.trim();
      jobTypeCounts[type] = (jobTypeCounts[type] || 0) + 1;
    }

    // Count location type
    if (job.location && job.location.toLowerCase().includes('onsite')) {
      onsiteCount++;
    } else if (!job.location || job.location === 'Onsite') {
      onsiteCount++;
    }
  });

  // Sort categories by count and get top 10
  const categories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const jobTypes = Object.entries(jobTypeCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const salaryRanges = [
    { name: 'up to $20,000', count: 13 },
    { name: '$20,000 - $40,000', count: 95 },
    { name: '$40,000 - $75,000', count: 401 },
    { name: '$75,000 - $100,000', count: 218 },
    { name: '$100,000 - $150,000', count: 264 },
    { name: '$150,000 - $200,000', count: 138 },
  ];

  return (
    <div className="space-y-6">
      {/* Email Job Alerts */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Email me jobs like this</h3>
        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded"
          >
            CREATE ALERT
          </button>
        </form>
      </div>

      {/* Refine by Categories */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Refine by Categories</h3>
        <ul className="space-y-2">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <li key={index}>
                <a href="#" className="flex justify-between text-gray-700 hover:text-yellow-500">
                  <span>{category.name}</span>
                  <span className="font-semibold text-yellow-500">{category.count.toLocaleString()}</span>
                </a>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-sm">No categories available</li>
          )}
        </ul>
      </div>

      {/* Refine by Job Type */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Refine by Job Type</h3>
        <ul className="space-y-2">
          {jobTypes.length > 0 ? (
            jobTypes.map((type, index) => (
              <li key={index}>
                <a href="#" className="flex justify-between text-gray-700 hover:text-yellow-500">
                  <span>{type.name}</span>
                  <span className="font-semibold text-yellow-500">{type.count.toLocaleString()}</span>
                </a>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-sm">No job types available</li>
          )}
        </ul>
      </div>

      {/* Refine by Salary Range */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Refine by Salary Range</h3>
        <ul className="space-y-2">
          {salaryRanges.map((range, index) => (
            <li key={index}>
              <a href="#" className="flex justify-between text-gray-700 hover:text-yellow-500">
                <span>{range.name}</span>
                <span className="font-semibold text-yellow-500">{range.count}</span>
              </a>
            </li>
          ))}
          <li>
            <a href="#" className="text-gray-700 hover:text-yellow-500 text-sm">
              more v
            </a>
          </li>
        </ul>
      </div>

      {/* Refine by Onsite/Remote */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Refine by</h3>
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Onsite/Remote</h4>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex justify-between text-gray-700 hover:text-yellow-500">
              <span>Onsite</span>
              <span className="font-semibold text-yellow-500">{onsiteCount.toLocaleString()}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
