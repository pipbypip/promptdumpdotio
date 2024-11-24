import React from 'react'
import { Terminal } from 'lucide-react'

interface LogoProps {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <a href="/" className={`flex items-center space-x-2 ${className}`}>
      <img src="/logo.png" alt="PromptDump Logo" className="h-8 w-auto mr-2" />
      <Terminal className="w-6 h-6 text-primary" />
      <span className="text-lg font-bold bg-gradient-to-r from-primary via-primary to-accent inline-block text-transparent bg-clip-text">
        promptdump.io
      </span>
    </a>
  )
}
