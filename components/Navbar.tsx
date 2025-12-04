import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Hexagon } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Hexagon className="w-8 h-8 text-blue-500 group-hover:rotate-90 transition-transform duration-500" strokeWidth={1.5} />
            <span className="text-xl font-bold tracking-widest text-white">AUREUS</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Accueil</Link>
            
            <div 
              className="relative group"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white transition-colors py-2">
                <span>Solutions</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {solutionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px]"
                  >
                    <div className="bg-[#0a0a16] border border-white/10 rounded-xl p-6 grid grid-cols-3 gap-4 shadow-2xl shadow-blue-900/10">
                      {Object.values(Division).map((div) => (
                        <Link 
                          key={div} 
                          to={`/solutions?division=${div}`}
                          className="group/card block p-4 rounded-lg hover:bg-white/5 transition-colors text-center"
                        >
                          <h4 className={`text-sm font-bold mb-1 ${DIVISION_CONFIG[div].color}`}>{DIVISION_CONFIG[div].label}</h4>
                          <p className="text-xs text-gray-400 font-medium mb-1">{DIVISION_CONFIG[div].slogan}</p>
                          <p className="text-[10px] text-gray-500">{DIVISION_CONFIG[div].desc}</p>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/work" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Réalisations</Link>
            <Link to="/pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Tarifs</Link>
            <Link to="/blog" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Blog</Link>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Link 
              to="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]"
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
            className="md:hidden bg-[#050510] border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <Link to="/" className="block text-lg font-medium text-white" onClick={() => setIsOpen(false)}>Accueil</Link>
              
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Solutions</p>
                {Object.values(Division).map((div) => (
                  <Link 
                    key={div} 
                    to={`/solutions?division=${div}`}
                    className={`block text-base ${DIVISION_CONFIG[div].color}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {DIVISION_CONFIG[div].slogan} <span className="text-xs text-gray-500">({DIVISION_CONFIG[div].label})</span>
                  </Link>
                ))}
              </div>

              <Link to="/work" className="block text-lg font-medium text-white" onClick={() => setIsOpen(false)}>Réalisations</Link>
              <Link to="/pricing" className="block text-lg font-medium text-white" onClick={() => setIsOpen(false)}>Tarifs</Link>
              <Link to="/blog" className="block text-lg font-medium text-white" onClick={() => setIsOpen(false)}>Blog</Link>
              <Link to="/contact" className="block text-lg font-medium text-white" onClick={() => setIsOpen(false)}>Contact</Link>
              
              <Link 
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-bold"
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