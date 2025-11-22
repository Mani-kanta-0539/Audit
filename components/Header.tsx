
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UserIcon } from './icons/UserIcon';
import Button from './Button';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, isAuthenticated, logout }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [firestorePhoto, setFirestorePhoto] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for user profile changes in Firestore
  useEffect(() => {
    if (auth.currentUser) {
      const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setFirestorePhoto(data.photoURL || null);
        }
      });
      return () => unsub();
    } else {
      setFirestorePhoto(null);
    }
  }, [auth.currentUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors duration-200 ${isActive
      ? 'text-primary'
      : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary'
    }`;

  const userPhoto = firestorePhoto || auth.currentUser?.photoURL;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md shadow-sm py-2 border-b border-gray-100 dark:border-gray-800'
        : 'bg-transparent py-4'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Left Side: Logo */}
          <div className="flex-shrink-0 z-10">
            <NavLink to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
              <div className="bg-primary text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <span className="font-display font-bold text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-white tracking-tight">
                GritGrade<span className="hidden sm:inline"> Audit Tool</span>
              </span>
            </NavLink>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClasses} end>Home</NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={navLinkClasses}>Workspace</NavLink>
                <NavLink to="/progress" className={navLinkClasses}>Analytics</NavLink>
                <NavLink to="/history" className={navLinkClasses}>History</NavLink>
              </>
            )}
          </nav>

          {/* Right Side: Auth, Theme & Profile */}
          <div className="flex items-center space-x-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Menu Toggle (visible on mobile only) */}
            {isAuthenticated && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <NavLink to="/login" className="text-sm font-bold text-gray-700 dark:text-white hover:text-primary transition-colors hidden sm:block">
                  Log In
                </NavLink>
                <NavLink to="/register">
                  <Button size="sm">Sign Up</Button>
                </NavLink>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 focus:outline-none hover:border-primary transition-all overflow-hidden"
                >
                  {userPhoto ? (
                    <img src={userPhoto} alt="User Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-midnight-card rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{auth.currentUser?.displayName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{auth.currentUser?.email}</p>
                    </div>

                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile Settings
                    </NavLink>

                    <NavLink
                      to="/progress"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Progress Tracking
                    </NavLink>

                    <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
            <nav className="flex flex-col space-y-1 pt-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg font-semibold transition-colors ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg font-semibold transition-colors ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Workspace
              </NavLink>
              <NavLink
                to="/progress"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg font-semibold transition-colors ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analytics
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg font-semibold transition-colors ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                History
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
