import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Division, DIVISION_CONFIG } from '../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Testimonials } from '../components/Testimonials';
import { useSEO } from '../hooks/useSEO';

export const Solutions: React.FC = () => {
  const query = new URLSearchParams(useLocation().search);
  const activeDivision = (query.get('division') as Division) || Division.TECH;
  const config = DIVISION_CONFIG[activeDivision];

  useSEO({
    title: `${config.label} - Solutions`,
    description: config.desc,
    type: 'website'
  });

  // Visual Vibe config based on strategy
  const isTech = activeDivision === Division.TECH;
  const isStudio = activeDivision === Division.STUDIO;
  
  const themeClasses = isTech 
    ? "font-mono" 
    : isStudio 
      ? "font-serif italic" 
      : "";

  const crossPollination = {
    [Division.TECH]: {
        text: "Besoin de contenu visuel pour votre nouveau site ?",
        linkText: "Découvrir Aureus Studio",
        target: Division.STUDIO
    },
    [Division.STUDIO]: {
        text: "Vous voulez diffuser votre vidéo efficacement ?",
        linkText: "Voir Aureus Brand",
        target: Division.BRAND
    },
    [Division.BRAND]: {
        text: "Prêt à automatiser votre croissance ?",
        linkText: "Explorer Aureus Tech",
        target: Division.TECH
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className={`relative py-32 overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${config.gradient} opacity-5`} />
        {isTech && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />}
        {isStudio && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />}
        
        <div className="z-10 relative mx-auto px-6 max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className={`inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest mb-6 ${config.color}`}>
                DIVISION : {config.label.toUpperCase()}
            </span>
            <h1 className={`text-5xl md:text-7xl font-bold text-white mb-6 ${themeClasses}`}>
                {config.slogan}
            </h1>
            <p className="max-w-2xl text-gray-300 text-xl leading-relaxed">
                {activeDivision === Division.TECH && "Transformation digitale de bout en bout. Nous codons vos idées et automatisons vos processus."}
                {activeDivision === Division.STUDIO && "Production cinématographique haut de gamme. Nous capturons l'émotion et sculptons la lumière."}
                {activeDivision === Division.BRAND && "Stratégie de marque impactante. Nous construisons des communautés et des identités mémorables."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sub-Services Details */}
      <div className="mx-auto px-6 py-20 max-w-7xl">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
            {config.subServices?.map((service, idx) => (
                <div key={idx} className="group bg-[#0a0a16] p-8 border border-white/5 hover:border-white/20 rounded-xl transition-all duration-300">
                    <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 ${config.color} group-hover:scale-110 transition-transform`}>
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="mb-3 font-bold text-white text-xl">{service.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Feature Showcase (Landing Page Style) */}
      <div className="bg-white/5 py-20 border-white/5 border-y">
        <div className="items-center gap-16 grid grid-cols-1 md:grid-cols-2 mx-auto px-6 max-w-7xl">
            <div className="order-2 md:order-1">
                <img 
                    src={`https://picsum.photos/seed/${activeDivision}feat/800/600`} 
                    alt="Feature" 
                    className="opacity-80 shadow-2xl rounded-2xl"
                />
            </div>
            <div className="order-1 md:order-2">
                <h2 className="mb-6 font-bold text-white text-3xl">
                    {isTech ? "Audit Gratuit : Êtes-vous prêt pour l'IA ?" : 
                     isStudio ? "Téléchargez notre Lookbook Cinéma" : 
                     "Audit de Marque Gratuit"}
                </h2>
                <p className="mb-8 text-gray-400 text-lg">
                    {isTech ? "Découvrez comment nos agents IA peuvent réduire votre charge de support client de 70%." :
                     isStudio ? "Explorez nos styles de colorimétrie et nos techniques de cadrage pour votre prochain projet." :
                     "Analysez votre présence actuelle et découvrez les leviers de croissance inexploités."}
                </p>
                <Link to="/contact" className={`px-8 py-3 rounded-lg font-bold text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity`}>
                    {isTech ? "Demander un Audit" : "Télécharger"}
                </Link>
            </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mx-auto px-6 py-24 max-w-7xl">
        <Testimonials filterByDivision={activeDivision} showAll={false} />
      </div>

      {/* Cross Pollination */}
      <div className="mx-auto px-6 py-24 max-w-7xl text-center">
        <div className="inline-block bg-gradient-to-r from-gray-800 to-black p-1 rounded-full">
            <div className="flex items-center space-x-4 bg-[#050510] px-8 py-4 rounded-full">
                <span className="text-gray-300">{crossPollination[activeDivision].text}</span>
                <Link 
                    to={`/solutions?division=${crossPollination[activeDivision].target}`} 
                    className={`font-bold flex items-center space-x-1 ${DIVISION_CONFIG[crossPollination[activeDivision].target].color}`}
                >
                    <span>{crossPollination[activeDivision].linkText}</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};