import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Division } from '../types';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companyLogo?: string;
  photo?: string;
  content: string;
  rating: number;
  division?: Division;
  videoUrl?: string;
}

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    role: 'CEO',
    company: 'TechStartup',
    content: 'Aureus a transformé notre présence digitale. Leur approche technique et créative est exceptionnelle. ROI de 300% en 6 mois.',
    rating: 5,
    division: Division.TECH
  },
  {
    id: '2',
    name: 'Marc Dubois',
    role: 'Directeur Marketing',
    company: 'FashionBrand',
    content: 'La production vidéo d\'Aureus Studio a dépassé toutes nos attentes. Leur sens du détail et leur créativité sont remarquables.',
    rating: 5,
    division: Division.STUDIO
  },
  {
    id: '3',
    name: 'Julie Chen',
    role: 'Fondatrice',
    company: 'EcoLife',
    content: 'Le rebranding complet réalisé par Aureus Brand a revitalisé notre image de marque. Nos ventes ont augmenté de 150%.',
    rating: 5,
    division: Division.BRAND
  },
  {
    id: '4',
    name: 'Thomas Laurent',
    role: 'CTO',
    company: 'FinTech Corp',
    content: 'L\'automatisation mise en place par Aureus Tech nous fait économiser 20 heures par semaine. Un investissement qui se rentabilise rapidement.',
    rating: 5,
    division: Division.TECH
  }
];

interface TestimonialsProps {
  filterByDivision?: Division;
  showAll?: boolean;
  className?: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({
  filterByDivision,
  showAll = false,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const filteredTestimonials = filterByDivision
    ? MOCK_TESTIMONIALS.filter(t => t.division === filterByDivision)
    : MOCK_TESTIMONIALS;

  const displayedTestimonials = showAll ? filteredTestimonials : filteredTestimonials.slice(0, 3);
  const testimonialsToShow = showAll ? displayedTestimonials : [displayedTestimonials[currentIndex]];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayedTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + displayedTestimonials.length) % displayedTestimonials.length);
  };

  if (filteredTestimonials.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Ils nous font confiance</h2>
          <p className="text-gray-400">Découvrez ce que nos clients disent de nous</p>
        </div>
        {!showAll && displayedTestimonials.length > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={prevTestimonial}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {showAll ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0a0a16] border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-blue-400 mb-4 opacity-50" />
              <p className="text-gray-300 mb-6 leading-relaxed">{testimonial.content}</p>
              <div className="flex items-center space-x-3">
                {testimonial.photo ? (
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#0a0a16] border border-white/10 rounded-2xl p-8 md:p-12"
            >
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(displayedTestimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <Quote className="w-12 h-12 text-blue-400 mb-6 opacity-50" />
              <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                {displayedTestimonials[currentIndex].content}
              </p>
              <div className="flex items-center space-x-4">
                {displayedTestimonials[currentIndex].photo ? (
                  <img
                    src={displayedTestimonials[currentIndex].photo}
                    alt={displayedTestimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {displayedTestimonials[currentIndex].name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-white text-lg">{displayedTestimonials[currentIndex].name}</div>
                  <div className="text-gray-400">{displayedTestimonials[currentIndex].role}, {displayedTestimonials[currentIndex].company}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots indicator */}
          {displayedTestimonials.length > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              {displayedTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-blue-400 w-8' : 'bg-white/20'
                  }`}
                  aria-label={`Aller au témoignage ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

