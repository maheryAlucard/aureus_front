import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Division, DIVISION_CONFIG } from '../types';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSolutionsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'bg-[#050510]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center space-x-2">
            <img
              src="/images/logo aureus.png"
              alt="Aureus logo"
              className="w-auto h-9 group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium text-gray-300 hover:text-white text-sm transition-colors">Accueil</Link>
            
            <div 
              className="group relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button className="flex items-center space-x-1 py-2 font-medium text-gray-300 hover:text-white text-sm transition-colors">
                <span>Solutions</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="top-full left-1/2 absolute pt-4 w-[600px] -translate-x-1/2"
                  >
                    <div className="gap-4 grid grid-cols-3 bg-[#0a0a16] shadow-2xl shadow-blue-900/10 p-6 border border-white/10 rounded-xl">
                      {Object.values(Division).map((div) => (
                        <Link 
                          key={div} 
                          to={`/solutions?division=${div}`}
                          className="group/card block hover:bg-white/5 p-4 rounded-lg text-center transition-colors"
                        >
                          <h4 className={`text-sm font-bold mb-1 ${DIVISION_CONFIG[div].color}`}>{DIVISION_CONFIG[div].label}</h4>
                          <p className="mb-1 font-medium text-gray-400 text-xs">{DIVISION_CONFIG[div].slogan}</p>
                          <p className="text-[10px] text-gray-500">{DIVISION_CONFIG[div].desc}</p>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/work" className="font-medium text-gray-300 hover:text-white text-sm transition-colors">Réalisations</Link>
            <Link to="/pricing" className="font-medium text-gray-300 hover:text-white text-sm transition-colors">Tarifs</Link>
            <Link to="/blog" className="font-medium text-gray-300 hover:text-white text-sm transition-colors">Blog</Link>
          </div>

          {/* CTA & Login */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/admin/login"
              className="flex items-center space-x-2 text-gray-400 hover:text-white text-sm transition-colors"
              title="Connexion Admin"
            >
              <Lock className="w-4 h-4" />
              <span>Admin</span>
            </Link>
            <Link 
              to="/contact"
              className="bg-blue-600 hover:bg-blue-700 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] px-5 py-2 rounded-full font-bold text-white text-sm transition-all"
            >
              Démarrer un Projet
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050510] border-white/10 border-b overflow-hidden"
          >
            <div className="space-y-6 px-6 py-8">
              <Link to="/" className="block font-medium text-white text-lg" onClick={() => setIsOpen(false)}>Accueil</Link>
              
              <div className="space-y-3">
                <p className="font-bold text-gray-500 text-xs uppercase tracking-widest">Solutions</p>
                {Object.values(Division).map((div) => (
                  <Link 
                    key={div} 
                    to={`/solutions?division=${div}`}
                    className={`block text-base ${DIVISION_CONFIG[div].color}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {DIVISION_CONFIG[div].slogan} <span className="text-gray-500 text-xs">({DIVISION_CONFIG[div].label})</span>
                  </Link>
                ))}
              </div>

              <Link to="/work" className="block font-medium text-white text-lg" onClick={() => setIsOpen(false)}>Réalisations</Link>
              <Link to="/pricing" className="block font-medium text-white text-lg" onClick={() => setIsOpen(false)}>Tarifs</Link>
              <Link to="/blog" className="block font-medium text-white text-lg" onClick={() => setIsOpen(false)}>Blog</Link>
              <Link to="/contact" className="block font-medium text-white text-lg" onClick={() => setIsOpen(false)}>Contact</Link>
              
              <Link 
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex justify-center items-center space-x-2 py-3 border border-white/10 rounded-lg w-full text-gray-400 hover:text-white transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Connexion Admin</span>
              </Link>
              
              <Link 
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block bg-blue-600 py-3 rounded-lg w-full font-bold text-white text-center"
              >
                Démarrer un Projet
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};