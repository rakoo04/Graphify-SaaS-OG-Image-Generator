
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen hero-gradient text-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45" />
            </div>
            <span className="font-bold text-xl tracking-tight">Graphify</span>
            <span className="text-xs font-medium bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 border border-slate-200 ml-2">BETA</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-black transition-colors">Pricing</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-black transition-colors">Gallery</a>
            <button className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-all">
              Sign In
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      <footer className="py-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-400">
            &copy; 2025 Graphify SaaS. Built for world-class founders.
          </p>
        </div>
      </footer>
    </div>
  );
};
