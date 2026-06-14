import React, { useState } from 'react';
import { Menu, X, ArrowRight, Cpu, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentView: 'landing' | 'demo' | 'dashboard';
  onViewChange: (view: 'landing' | 'demo' | 'dashboard') => void;
  onContactClick: () => void;
}

// Inline custom SVGs for social brands (since newer lucide-react versions do not export them)
const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange, onContactClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', view: 'landing' as const, hash: '#home' },
    { label: 'How It Works', view: 'landing' as const, hash: '#how-it-works' },
    { label: 'Philosophy', view: 'landing' as const, hash: '#philosophy' },
    { label: 'Use Cases', view: 'landing' as const, hash: '#use-cases' },
  ];

  const handleLinkClick = (view: 'landing' | 'demo' | 'dashboard', hash?: string) => {
    onViewChange(view);
    setMobileMenuOpen(false);
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/10 backdrop-blur-[2px] px-6 md:px-28 py-4 flex items-center justify-between select-none">
        
        {/* Left: Concentric circles logo + Bold text */}
        <button 
          onClick={() => handleLinkClick('landing', '#home')}
          className="flex items-center gap-3 cursor-pointer group focus:outline-none"
        >
          <div className="relative w-7 h-7 rounded-full border-2 border-foreground/60 flex items-center justify-center transition-transform group-hover:rotate-45 duration-500">
            <div className="w-3 h-3 rounded-full border border-foreground/60" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-foreground uppercase">
            The VR Casa
          </span>
        </button>

        {/* Center-left: Nav Links separated by bullets (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          {navLinks.map((link, idx) => (
            <React.Fragment key={link.label}>
              <button
                onClick={() => handleLinkClick(link.view, link.hash)}
                className={`transition-colors py-1 ${
                  currentView === link.view
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </button>
              {idx < navLinks.length - 1 && (
                <span className="text-muted-foreground/30 select-none">•</span>
              )}
            </React.Fragment>
          ))}
          
          <span className="text-muted-foreground/30 select-none">•</span>
          
          <button
            onClick={() => handleLinkClick('demo')}
            className={`transition-colors py-1 ${
              currentView === 'demo'
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Quote Funnel
          </button>
          
          <span className="text-muted-foreground/30 select-none">•</span>
          
          <button
            onClick={() => handleLinkClick('dashboard')}
            className={`transition-colors py-1 flex items-center gap-1 ${
              currentView === 'dashboard'
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Right: Social icons in liquid-glass circles */}
        <div className="hidden md:flex items-center gap-2.5">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95"
          >
            <LinkedinIcon />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95"
          >
            <TwitterIcon />
          </a>

          <button
            onClick={() => {
              handleLinkClick('demo');
              onContactClick();
            }}
            className="ml-4 bg-foreground text-background text-xs font-semibold px-4.5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
          >
            Run Demo <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-foreground z-50 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </nav>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-lg flex flex-col justify-center px-8 gap-8 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-medium">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.view, link.hash)}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ))}
              
              <div className="h-px bg-border/40 my-2" />
              
              <button
                onClick={() => handleLinkClick('demo')}
                className="text-left text-foreground font-semibold flex items-center gap-2"
              >
                <Cpu className="w-6 h-6 text-muted-foreground" />
                Quote Funnel MVP
              </button>
              <button
                onClick={() => handleLinkClick('dashboard')}
                className="text-left text-foreground font-semibold flex items-center gap-2"
              >
                <ShieldAlert className="w-6 h-6 text-muted-foreground" />
                Admin Dashboard
              </button>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <a href="https://instagram.com" className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center text-muted-foreground">
                <InstagramIcon />
              </a>
              <a href="https://linkedin.com" className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center text-muted-foreground">
                <LinkedinIcon />
              </a>
              <a href="https://twitter.com" className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center text-muted-foreground">
                <TwitterIcon />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
