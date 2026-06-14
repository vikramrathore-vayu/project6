import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border/30 bg-[#000] py-12 px-8 md:px-28 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono">
      <div className="text-muted-foreground text-center md:text-left">
        © 2026 The VR Casa. All rights reserved. Built by Vikram Rathore.
      </div>
      <div className="flex gap-6 text-muted-foreground">
        <a href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
        <a href="#terms" className="hover:text-foreground transition-colors">Terms of Service</a>
        <a href="mailto:hello@thevrcasa.com" className="hover:text-foreground transition-colors">Contact</a>
      </div>
    </footer>
  );
};
