import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  activePage?: string;
}

export default function Header({ activePage = '' }: HeaderProps) {
  return (
    <header className="bg-white">
      <div className="container mx-auto px-4 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/logo.jpg"
                alt="TopOneHire Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>
          
          {/* Navigation Links (Center) */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              href="/jobs" 
              className={`font-medium text-sm ${
                activePage === 'jobs' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              Jobs
            </Link>
            <Link 
              href="/companies" 
              className={`font-medium text-sm ${
                activePage === 'companies' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              Companies
            </Link>
            <Link href="#" className="text-gray-700 hover:text-yellow-500 font-medium text-sm">
              Post a Job
            </Link>
            <Link href="#" className="text-gray-700 hover:text-yellow-500 font-medium text-sm">
              Create/Post Your Resume
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium text-sm ${
                activePage === 'contact' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              Contact Us
            </Link>
            <Link 
              href="/employer-products" 
              className={`font-medium text-sm ${
                activePage === 'employer-products' 
                  ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-700 hover:text-yellow-500'
              }`}
            >
              Employer Products
            </Link>
          </nav>
          
          {/* Sign In/Sign Up (Right Side) */}
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-800 font-medium text-sm">
              SIGN IN
            </a>
            <a href="#" className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800 px-4 py-2 rounded border border-gray-400 font-medium text-sm">
              SIGN UP
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
