import React, { useState } from 'react';
import { Mail, Check, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '../utils/analytics';

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'inline';
  source?: string;
  onSuccess?: () => void;
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'default',
  source = 'unknown',
  onSuccess,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage('Veuillez entrer votre email');
      setStatus('error');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Veuillez entrer un email valide');
      setStatus('error');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // Simulate API call - in production, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for demo (in production, send to backend)
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push({ email, source, date: new Date().toISOString() });
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      }

      setStatus('success');
      analytics.trackNewsletterSignup(source);
      analytics.trackConversion('newsletter_signup');
      
      if (onSuccess) {
        onSuccess();
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setEmail('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Une erreur s\'est produite. Veuillez réessayer.');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex items-center space-x-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          className="flex-1 bg-white/5 px-4 py-2 border border-white/10 focus:border-blue-500 rounded-lg focus:outline-none text-white transition-colors placeholder-gray-500"
          disabled={isSubmitting || status === 'success'}
        />
        <button
          type="submit"
          disabled={isSubmitting || status === 'success'}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg font-medium text-white transition-colors disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : status === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            'S\'inscrire'
          )}
        </button>
      </form>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`bg-[#0a0a16] border border-white/10 rounded-xl p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <Mail className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Restez informé</h3>
            <p className="text-gray-400 text-sm">Recevez nos dernières actualités</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="bg-black/20 px-4 py-3 border border-white/10 focus:border-blue-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
            disabled={isSubmitting || status === 'success'}
          />
          {status === 'error' && errorMessage && (
            <p className="text-red-400 text-sm">{errorMessage}</p>
          )}
          {status === 'success' && (
            <p className="text-green-400 text-sm">Merci ! Vérifiez votre boîte mail.</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || status === 'success'}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg w-full font-bold text-white transition-colors disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Inscription...' : status === 'success' ? 'Inscrit !' : 'S\'inscrire à la newsletter'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-2xl p-8 md:p-12 ${className}`}>
      <div className="mx-auto max-w-2xl text-center">
        <div className="inline-flex justify-center items-center bg-blue-500/10 mb-6 border border-blue-500/20 rounded-2xl w-16 h-16">
          <Mail className="w-8 h-8 text-blue-400" />
        </div>
        <h2 className="mb-4 font-bold text-white text-3xl md:text-4xl">
          Restez à la pointe de l'innovation
        </h2>
        <p className="mb-8 text-gray-300 text-lg">
          Recevez nos analyses exclusives, tutoriels et réflexions sur le futur du digital.
        </p>
        
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-center items-center space-x-2 text-green-400"
            >
              <Check className="w-6 h-6" />
              <span className="font-medium text-lg">Merci ! Vérifiez votre boîte mail.</span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="flex sm:flex-row flex-col gap-4 mx-auto max-w-md"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 bg-black/30 px-6 py-4 border border-white/10 focus:border-blue-500 rounded-lg focus:outline-none text-white transition-colors placeholder-gray-500"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-8 py-4 rounded-lg font-bold text-white whitespace-nowrap transition-colors disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Inscription...</span>
                  </span>
                ) : (
                  'S\'inscrire'
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
        
        {status === 'error' && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-red-400 text-sm"
          >
            {errorMessage}
          </motion.p>
        )}
        
        <p className="mt-6 text-gray-500 text-xs">
          Nous respectons votre vie privée. Désinscription possible à tout moment.
        </p>
      </div>
    </div>
  );
};

