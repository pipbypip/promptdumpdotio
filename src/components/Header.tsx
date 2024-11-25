import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Sun, Moon, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { AuthModal } from './AuthModal'
import { Logo } from './Logo'

export function Header() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to log out:', error)
    }
  }

  return (
    <>
      <header className={`border-b sticky top-0 backdrop-blur-sm z-50 safe-top ${
        theme === 'dark' 
          ? 'bg-[#1f2329]/95 border-[#3a3a3a] text-gray-200' 
          : 'bg-[#1f2329]/95 border-[#3a3a3a] text-gray-200'
      }`}>
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-8">
            <Logo />
            <nav className="hidden md:flex space-x-8">
              <Link
                to={user ? "/feed" : "#"}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    setIsAuthModalOpen(true);
                  }
                }}
                className={`hover:text-${theme === 'dark' ? 'white' : 'gray-600'} transition-colors`}
              >
                Dump Feed
              </Link>
              <Link
                to="/explore"
                className={`hover:text-${theme === 'dark' ? 'white' : 'gray-600'} transition-colors`}
              >
                Explore
              </Link>
              <Link
                to="/about"
                className={`hover:text-${theme === 'dark' ? 'white' : 'gray-600'} transition-colors`}
              >
                About
              </Link>
              {user && (
                <Link 
                  to="/profile" 
                  className={`hover:text-${theme === 'dark' ? 'white' : 'gray-600'} transition-colors`}
                >
                  Profile
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors group ${
                theme === 'dark' 
                  ? 'hover:bg-[#2a2a2a]' 
                  : 'hover:bg-[#8f8f8f]'
              }`}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className={`w-5 h-5 transition-colors group-hover:text-black`} />
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.uid}`}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:inline">{user.displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'hover:bg-[#2a2a2a]' 
                      : 'hover:bg-gray-100'
                  }`}
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="matrix-gradient px-4 py-2 rounded-lg font-semibold"
              >
                Sign In
              </button>
            )}

            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-[#2a2a2a]' 
                  : 'hover:bg-gray-100'
              }`}
              title="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}