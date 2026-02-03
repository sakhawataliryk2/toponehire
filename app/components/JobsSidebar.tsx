export default function JobsSidebar() {
  const categories = [
    { name: 'Healthcare', count: 5346 },
    { name: 'Accounting', count: 908 },
    { name: 'Nurse', count: 854 },
    { name: 'Finance', count: 772 },
    { name: 'Management', count: 596 },
    { name: 'Information Technology', count: 465 },
    { name: 'Marketing', count: 461 },
    { name: 'Insurance', count: 400 },
    { name: 'Executive', count: 399 },
    { name: 'Legal', count: 344 },
  ];

  const jobTypes = [
    { name: 'Full time', count: 463 },
    { name: 'Part time', count: 76 },
    { name: 'Intern', count: 5 },
  ];

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
          {categories.map((category, index) => (
            <li key={index}>
              <a href="#" className="flex justify-between text-gray-700 hover:text-yellow-500">
                <span>{category.name}</span>
                <span className="font-semibold text-yellow-500">{category.count}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Refine by Job Type */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Refine by Job Type</h3>
        <ul className="space-y-2">
          {jobTypes.map((type, index) => (
            <li key={index}>
              <a href="#" className="flex justify-between text-gray-700 hover:text-yellow-500">
                <span>{type.name}</span>
                <span className="font-semibold text-yellow-500">{type.count}</span>
              </a>
            </li>
          ))}
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
              <span className="font-semibold text-yellow-500">10306</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
