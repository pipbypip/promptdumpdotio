import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { MotionProvider } from './contexts/MotionContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Feed } from './pages/Feed'
import { Profile } from './pages/Profile'
import { Home } from './pages/Home'
import { Explore } from './pages/Explore'
import { About } from './pages/About'
import { Privacy } from './pages/Privacy'
import { Terms } from './pages/Terms'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicProfile } from './pages/PublicProfile'

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
    <React.StrictMode>
      <MotionProvider>
        <AuthProvider>
          <ThemeProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/u/:username" element={<PublicProfile />} />
                    
                    {/* Protected routes */}
                    <Route
                      path="/feed"
                      element={
                        <ProtectedRoute>
                          <Feed />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </MotionProvider>
    </React.StrictMode>
  )
}