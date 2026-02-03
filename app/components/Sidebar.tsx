export default function Sidebar() {
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

  const states = [
    { name: 'Texas', count: 1060 },
    { name: 'Florida', count: 834 },
    { name: 'California', count: 702 },
    { name: 'Colorado', count: 569 },
    { name: 'New York', count: 476 },
    { name: 'Virginia', count: 427 },
    { name: 'Tennessee', count: 362 },
    { name: 'Alaska', count: 320 },
    { name: 'Illinois', count: 316 },
    { name: 'Georgia', count: 271 },
  ];

  return (
    <div className="space-y-6">
      {/* Employers Section */}
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Employers</h3>
        <p className="text-gray-700 mb-4">
          Advertise your job to get qualified applicants.
        </p>
        <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded">
          Post a Job
        </button>
      </div>

      {/* Job Alerts Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Sign up for job alerts</h3>
        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Keywords"
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div className="flex space-x-2">
            <label className="flex items-center">
              <input type="radio" name="frequency" value="daily" className="mr-2" />
              <span className="text-sm text-gray-700">Daily</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="frequency" value="weekly" className="mr-2" defaultChecked />
              <span className="text-sm text-gray-700">Weekly</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="frequency" value="monthly" className="mr-2" />
              <span className="text-sm text-gray-700">Monthly</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded"
          >
            Create Alert
          </button>
        </form>
      </div>

      {/* Jobs by Category */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Jobs by Category</h3>
        <ul className="space-y-2">
          {categories.map((category, index) => (
            <li key={index}>
              <a href="#" className="flex justify-between text-gray-700 hover:text-yellow-500">
                <span>{category.name}</span>
                <span className="font-semibold">{category.count}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Jobs by State */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Jobs by State</h3>
        <ul className="space-y-2">
          {states.map((state, index) => (
            <li key={index}>
              <a href="#" className="flex justify-between text-gray-700 hover:text-yellow-500">
                <span>{state.name}</span>
                <span className="font-semibold">{state.count}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
