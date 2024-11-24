import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Feed } from './pages/Feed'
import { Profile } from './pages/Profile'
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { ProtectedRoute } from './components/ProtectedRoute'

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-background-secondary p-6 rounded-lg transform transition hover:scale-105">
      <div className="p-3 bg-background-secondary-hover inline-block rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground-secondary">{description}</p>
    </div>
  )
}

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground font-mono">
            <Header />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/explore" element={<Explore />} />
              
              {/* Protected routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
}