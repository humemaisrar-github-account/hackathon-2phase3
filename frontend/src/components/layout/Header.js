import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../services/auth';

export default function Header() {
  const { isAuthenticated: isAuth, currentUser: user, logout: signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-blue-600 cursor-pointer">TodoFlow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/">
              <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors cursor-pointer">
                Home
              </span>
            </Link>
            <Link href="/#features">
              <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors cursor-pointer">
                Features
              </span>
            </Link>
            <Link href="/#about">
              <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors cursor-pointer">
                About
              </span>
            </Link>
            {isAuth && (
              <Link href="/dashboard">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors cursor-pointer">
                  Dashboard
                </span>
              </Link>
            )}
          </nav>

          {/* Right side - Auth buttons or user menu */}
          <div className="flex items-center space-x-4">
            {isAuth ? (
              <div className="flex items-center space-x-4">
                <span className="hidden md:block text-sm text-gray-700">
                  Welcome, {user?.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <span className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm cursor-pointer">
                    Sign In
                  </span>
                </Link>
                <Link href="/auth/signup">
                  <span className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm cursor-pointer">
                    Get Started
                  </span>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link href="/">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium cursor-pointer">
                  Home
                </span>
              </Link>
              <Link href="/#features">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium cursor-pointer">
                  Features
                </span>
              </Link>
              <Link href="/#about">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium cursor-pointer">
                  About
                </span>
              </Link>
              {isAuth && (
                <Link href="/dashboard">
                  <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium cursor-pointer">
                    Dashboard
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}