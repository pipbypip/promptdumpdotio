import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import googleLogo from '../assets/google-logo.svg'
import microsoftLogo from '../assets/microsoft-logo.svg'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'signin' | 'signup' | 'reset'

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const { signInWithEmail, signUpWithEmail, resetPassword, signInWithGoogle, signInWithMicrosoft } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password)
        onClose()
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, name)
        onClose()
      } else if (mode === 'reset') {
        await resetPassword(email)
        setResetSent(true)
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      onClose()
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google')
    }
  }

  const handleMicrosoftSignIn = async () => {
    try {
      await signInWithMicrosoft()
      onClose()
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Microsoft')
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-background/80 dark:bg-[#121212]/80 backdrop-blur-sm z-[100]"
      onClick={onClose}
    >
      <div className="w-full h-full flex justify-center p-4" style={{ paddingTop: '20vh' }}>
        <div 
          className="bg-gradient-to-b from-background via-background to-background/90 dark:from-[#1a1a1a] dark:via-[#1a1a1a] dark:to-[#1f1f1f] border border-border rounded-lg w-full max-w-md p-6 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200 h-fit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {mode === 'reset' && resetSent ? (
            <div className="text-center py-4">
              <p className="text-foreground-secondary mb-4">
                Password reset email sent! Check your inbox for further instructions.
              </p>
              <button
                onClick={() => {
                  setMode('signin')
                  setResetSent(false)
                }}
                className="text-primary hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {mode !== 'reset' && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full matrix-gradient font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Loading...'
                  : mode === 'signin'
                  ? 'Sign In'
                  : mode === 'signup'
                  ? 'Sign Up'
                  : 'Send Reset Link'}
              </button>

              {mode !== 'reset' && (
                <>
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-foreground-secondary">Or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-2 px-4 mb-2 bg-background-secondary hover:bg-background-secondary/80 border border-border rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <img src={googleLogo} alt="Google logo" className="w-5 h-5" />
                    Sign in with Google
                  </button>

                  <button
                    type="button"
                    onClick={handleMicrosoftSignIn}
                    className="w-full py-2 px-4 bg-background-secondary hover:bg-background-secondary/80 border border-border rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <img src={microsoftLogo} alt="Microsoft logo" className="w-5 h-5" />
                    Sign in with Microsoft
                  </button>
                </>
              )}

              <div className="text-sm text-center space-x-1">
                {mode === 'signin' ? (
                  <>
                    <span className="text-foreground-secondary">Don't have an account?</span>
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-sm hover:text-[#66cc66] transition-colors"
                    >
                      Sign Up
                    </button>
                  </>
                ) : mode === 'signup' ? (
                  <>
                    <span className="text-foreground-secondary">Already have an account?</span>
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-sm hover:text-[#66cc66] transition-colors"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-primary hover:underline"
                  >
                    Back to Sign In
                  </button>
                )}
              </div>

              {mode === 'signin' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-sm hover:text-[#66cc66] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
