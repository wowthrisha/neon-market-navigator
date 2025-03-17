
import React from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "min-h-screen bg-black overflow-hidden flex flex-col items-center justify-start w-full",
      className
    )}>
      {/* Subtle ambient background glow */}
      <div className="fixed inset-0 bg-black pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-neon-cyan/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-neon-pink/5 blur-[150px] rounded-full" />
        <div className="absolute top-1/3 right-1/3 w-1/4 h-1/4 bg-neon-yellow/5 blur-[150px] rounded-full" />
      </div>
      
      {/* Header with subtle glow */}
      <header className="w-full glass-morphism z-10 py-4 px-6 mb-6 animate-fade-in">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold neon-text-cyan">
            NEON<span className="neon-text-pink">MART</span>
          </h1>
          <p className="text-sm md:text-base text-white/80">
            Product Location Navigator
          </p>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 w-full container px-4 pb-6 z-10">
        {children}
      </main>
      
      {/* Footer with subtle neon glow */}
      <footer className="w-full glass-morphism z-10 py-3 mt-6">
        <div className="container mx-auto text-center text-white/60 text-sm">
          <p>Created with precision and care</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
