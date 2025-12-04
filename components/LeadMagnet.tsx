import React from 'react';
import { Download, FileText, Sparkles } from 'lucide-react';
import { NewsletterSignup } from './NewsletterSignup';
import { motion } from 'framer-motion';

interface LeadMagnetProps {
  title?: string;
  description?: string;
  offer?: string;
  className?: string;
}

export const LeadMagnet: React.FC<LeadMagnetProps> = ({
  title = "Guide Gratuit",
  description = "Téléchargez notre guide exclusif et découvrez les secrets pour transformer votre présence digitale.",
  offer = "10 Stratégies pour Transformer Votre Présence Digitale",
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 border border-white/10 rounded-2xl p-8 md:p-12 ${className}`}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start space-x-6 mb-8">
          <div className="flex-shrink-0">
            <div className="flex justify-center items-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl w-16 h-16">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">Offre Gratuite</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {title}
            </h3>
            <p className="text-gray-300 text-lg mb-4">
              {description}
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-bold">{offer}</p>
                  <p className="text-gray-400 text-sm">PDF • 15 pages • Téléchargement instantané</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0a16] border border-white/10 rounded-xl p-6">
          <h4 className="text-white font-bold mb-4 text-center">
            Téléchargez votre guide gratuit
          </h4>
          <p className="text-gray-400 text-sm text-center mb-6">
            Entrez votre email pour recevoir le guide instantanément
          </p>
          <NewsletterSignup
            variant="compact"
            source="lead_magnet"
          />
          <p className="mt-4 text-gray-500 text-xs text-center">
            En vous inscrivant, vous acceptez de recevoir nos emails. Désinscription possible à tout moment.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

