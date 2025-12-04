import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Division, Testimonial } from '../types';
import { useTestimonials } from '../hooks/useTestimonials';

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
  const { testimonials, fetchTestimonials } = useTestimonials();

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);
  
  const filteredTestimonials = filterByDivision
    ? testimonials.filter(t => t.division === filterByDivision)
    : testimonials;

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="mb-2 font-bold text-white text-3xl md:text-4xl">Ils nous font confiance</h2>
          <p className="text-gray-400">Découvrez ce que nos clients disent de nous</p>
        </div>
        {!showAll && displayedTestimonials.length > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={prevTestimonial}
              className="bg-white/5 hover:bg-white/10 p-2 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="bg-white/5 hover:bg-white/10 p-2 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {showAll ? (
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {displayedTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0a0a16] p-6 border border-white/10 rounded-xl"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="fill-yellow-400 w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <Quote className="opacity-50 mb-4 w-8 h-8 text-blue-400" />
              <p className="mb-6 text-gray-300 leading-relaxed">{testimonial.content}</p>
              <div className="flex items-center space-x-3">
                {testimonial.photo ? (
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="rounded-full w-12 h-12 object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-12 h-12 font-bold text-white">
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
              className="bg-[#0a0a16] p-8 md:p-12 border border-white/10 rounded-2xl"
            >
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(displayedTestimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="fill-yellow-400 w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <Quote className="opacity-50 mb-6 w-12 h-12 text-blue-400" />
              <p className="mb-8 text-gray-300 text-lg md:text-xl leading-relaxed">
                {displayedTestimonials[currentIndex].content}
              </p>
              <div className="flex items-center space-x-4">
                {displayedTestimonials[currentIndex].photo ? (
                  <img
                    src={displayedTestimonials[currentIndex].photo}
                    alt={displayedTestimonials[currentIndex].name}
                    className="rounded-full w-16 h-16 object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-16 h-16 font-bold text-white text-xl">
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

