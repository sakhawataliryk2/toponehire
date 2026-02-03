export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="mx-auto px-4 md:px-12 lg:px-24 xl:px-32 2xl:px-40 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 justify-items-center md:justify-items-start">
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">General</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400">Terms & Conditions</a></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Employer</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400">Post a Job</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400">Sign in</a></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Job Seeker</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-yellow-400">Find Jobs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400">Create Resume</a></li>
              <li><a href="#" className="text-gray-300 hover:text-yellow-400">Sign in</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8">
          <p className="text-gray-400 text-sm text-center">
            © 2008-2026 Powered by TopOneHire
          </p>
        </div>
      </div>
    </footer>
  );
}
