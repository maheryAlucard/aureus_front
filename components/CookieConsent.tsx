import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show after a short delay
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto bg-[#0a0a16] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <div className="flex justify-center items-center bg-yellow-500/10 border border-yellow-500/20 rounded-xl w-12 h-12">
                    <Cookie className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-2">Nous utilisons des cookies</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Ce site utilise des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. 
                    En continuant à naviguer, vous acceptez notre utilisation des cookies.{' '}
                    <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                      En savoir plus
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <button
                  onClick={handleDecline}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Refuser
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-bold transition-colors"
                >
                  Accepter
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

