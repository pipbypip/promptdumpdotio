import React from 'react'
import { Twitter, Github } from 'lucide-react'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="bg-[#090c10] border-t border-[#3a3a3a] safe-bottom">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Got prompts? Ditch the notepad and dump your prompts for better organisation, enhancement and sharing of powerful AI prompts and idea starters.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Product</h3>
            <ul className="space-y-2">
              <FooterLink href="/feed">Dump Feed</FooterLink>
              <FooterLink href="/explore">Explore</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-8 border-t border-[#3a3a3a] flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} promptdump.io. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <SocialLink href="https://twitter.com/promptdumpio" icon={<Twitter />} />
            <SocialLink href="https://github.com/promptdumpio" icon={<Github />} />
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {children}
      </a>
    </li>
  )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    </a>
  )
}