import { NavLink } from 'react-router-dom';

interface NavbarProps {
  onHealthCheck?: () => void;
  isLoading?: boolean;
}

export default function Navbar({ onHealthCheck, isLoading = false }: NavbarProps) {
  return (
    <nav className="bg-blue-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* App Name */}
            <div className="flex-shrink-0">
              <span className="text-white text-2xl font-bold tracking-wide">
                {import.meta.env.VITE_APP_NAME || 'Orah'}
              </span>
            </div>
            
            {/* Tabs */}
            <div className="hidden md:flex space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/triggers"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`
                }
              >
                Triggers
              </NavLink>
              <NavLink
                to="/concerns"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`
                }
              >
                Concerns
              </NavLink>
            </div>
          </div>

          {/* Health Check Button */}
          <div className="flex items-center">
            <button
              onClick={onHealthCheck}
              disabled={isLoading}
              className="
                inline-flex items-center gap-2
                bg-white text-blue-900 font-semibold
                px-4 py-2 rounded-lg text-sm
                hover:bg-blue-50 active:bg-blue-100
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-colors duration-150
              "
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-blue-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Checking…
                </>
              ) : (
                'Health Check'
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

