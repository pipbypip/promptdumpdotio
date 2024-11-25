import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { MotionProvider } from './contexts/MotionContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  useEffect(() => {
    // Debug logging
    console.log('App mounted');
    console.log('Environment variables loaded:', {
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
    });
  }, []);

  return (
    <div className="app-container">
      <ErrorBoundary>
        <MotionProvider>
          <AuthProvider>
            <ThemeProvider>
              <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <main className="flex-grow">
                  <Outlet />
                </main>
                <Footer />
              </div>
            </ThemeProvider>
          </AuthProvider>
        </MotionProvider>
      </ErrorBoundary>
    </div>
  )
}

export default App;