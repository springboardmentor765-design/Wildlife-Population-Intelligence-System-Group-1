'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Detection', path: '/detection' },
    { name: 'Sounds', path: '/sounds' },
    { name: 'Population Analytics', path: '/population' },
    { name: 'Map', path: '/map' },
    { name: 'Alerts', path: '/alerts' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-6 py-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="no-underline">
          <motion.h1 
            whileHover={{ scale: 1.05 }}
            className="text-xl md:text-2xl font-bold text-white m-0"
          >
            WildVision<span className="text-[#4CAF50]">AI</span>
          </motion.h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <motion.div key={item.name} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href={item.path} className="no-underline relative">
                  <span
                    className={`text-sm transition-colors duration-200 ${isActive ? 'text-[#4CAF50] font-bold' : 'text-zinc-400 font-normal hover:text-white'}`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#4CAF50] rounded-sm"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
          <Show when="signed-out">
            <div className="flex gap-4">
              <SignInButton>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent text-white border border-[#4CAF50] px-4 py-2 rounded-full font-bold text-sm cursor-pointer hover:bg-[#4CAF50]/10 transition-colors"
                >
                  Sign In
                </motion.button>
              </SignInButton>
              
              <SignUpButton>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#4CAF50] text-white border-none px-4 py-2 rounded-full font-bold text-sm cursor-pointer hover:bg-[#4CAF50]/90 transition-colors"
                >
                  Sign Up
                </motion.button>
              </SignUpButton>
            </div>
          </Show>
          <Show when="signed-in">
            <div className="flex gap-4 items-center">
              <Link href="/profile" className="text-zinc-400 hover:text-white no-underline font-bold text-sm transition-colors">
                Profile
              </Link>
              <UserButton />
            </div>
          </Show>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-zinc-400 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden mt-4 pt-4 pb-4 border-t border-white/10"
          >
            <div className="flex flex-col gap-4 pb-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.name} 
                    href={item.path} 
                    onClick={() => setIsOpen(false)}
                    className="no-underline"
                  >
                    <div className={`text-sm py-2 transition-colors duration-200 ${isActive ? 'text-[#4CAF50] font-bold' : 'text-zinc-400 font-normal hover:text-white'}`}>
                      {item.name}
                    </div>
                  </Link>
                );
              })}
              <Show when="signed-out">
                <div className="flex flex-col gap-3 pt-2">
                  <SignInButton>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-transparent text-white border border-[#4CAF50] py-2.5 rounded-full font-bold text-sm cursor-pointer hover:bg-[#4CAF50]/10 transition-colors"
                    >
                      Sign In
                    </motion.button>
                  </SignInButton>
                  
                  <SignUpButton>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-[#4CAF50] text-white border-none py-2.5 rounded-full font-bold text-sm cursor-pointer hover:bg-[#4CAF50]/90 transition-colors"
                    >
                      Sign Up
                    </motion.button>
                  </SignUpButton>
                </div>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <Link 
                    href="/profile" 
                    onClick={() => setIsOpen(false)}
                    className="text-zinc-400 hover:text-white no-underline font-bold text-sm transition-colors py-2"
                  >
                    Profile
                  </Link>
                  <UserButton />
                </div>
              </Show>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
