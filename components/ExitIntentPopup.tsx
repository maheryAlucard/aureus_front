import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Mail } from 'lucide-react';
import { NewsletterSignup } from './NewsletterSignup';

interface ExitIntentPopupProps {
  onClose?: () => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const popupShown = localStorage.getItem('exit_intent_popup_shown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves the top of the viewport
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        localStorage.setItem('exit_intent_popup_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const handleSuccess = () => {
    // Close after successful signup
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="z-50 fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="top-1/2 left-1/2 z-50 fixed mx-4 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative bg-[#0a0a16] shadow-2xl p-8 border border-white/10 rounded-2xl">
              <button
                onClick={handleClose}
                className="top-4 right-4 absolute p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 text-center">
                <div className="inline-flex justify-center items-center bg-gradient-to-r from-yellow-500/10 to-orange-500/10 mb-4 border border-yellow-500/20 rounded-2xl w-16 h-16">
                  <Gift className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="mb-2 font-bold text-white text-2xl">
                  Ne partez pas sans votre cadeau !
                </h2>
                <p className="text-gray-400">
                  Inscrivez-vous et recevez notre guide gratuit :<br />
                  <span className="font-bold text-white">"10 Stratégies pour Transformer Votre Présence Digitale"</span>
                </p>
              </div>

              <NewsletterSignup
                variant="inline"
                source="exit_intent"
                onSuccess={handleSuccess}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

