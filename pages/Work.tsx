import React, { useState } from 'react';
import { Division, DIVISION_CONFIG, Project } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PROJECTS: Project[] = [
  { id: '1', title: 'Nebula SaaS', client: 'Nebula Inc', division: Division.TECH, tags: ['React', 'Python', 'IA'], imageUrl: 'https://picsum.photos/seed/nebula/600/400', description: 'Tableau de bord entreprise.' },
  { id: '2', title: 'Lancement Nike Air', client: 'Nike', division: Division.STUDIO, tags: ['VFX', '3D', 'Montage'], imageUrl: 'https://picsum.photos/seed/nike/600/400', description: 'Campagne publicitaire mondiale.' },
  { id: '3', title: 'Identité Apex', client: 'Apex', division: Division.BRAND, tags: ['Stratégie', 'Logo', 'UI'], imageUrl: 'https://picsum.photos/seed/apex/600/400', description: 'Rebranding pour une licorne fintech.' },
  { id: '4', title: 'Quantum Trading', client: 'Quantum', division: Division.TECH, tags: ['WebSockets', 'Fintech'], imageUrl: 'https://picsum.photos/seed/quantum/600/400', description: 'Plateforme de trading ultra-rapide.' },
  { id: '5', title: 'Eco Life', client: 'Eco', division: Division.BRAND, tags: ['Packaging', 'Social'], imageUrl: 'https://picsum.photos/seed/eco/600/400', description: 'Lancement de produit durable.' },
  { id: '6', title: 'Teaser Cyberpunk', client: 'CDPR', division: Division.STUDIO, tags: ['CGI', 'Unreal Engine'], imageUrl: 'https://picsum.photos/seed/cyber/600/400', description: 'Bande-annonce cinématique de jeu.' },
];

export const Work: React.FC = () => {
  const [filter, setFilter] = useState<Division | 'ALL'>('ALL');

  const filteredProjects = filter === 'ALL' 
    ? MOCK_PROJECTS 
    : MOCK_PROJECTS.filter(p => p.division === filter);

  return (
    <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Projets Sélectionnés</h1>
          <p className="text-gray-400">Études de cas en ingénierie, production et stratégie.</p>
        </div>
        
        <div className="flex space-x-2 mt-6 md:mt-0">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === 'ALL' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            Tous
          </button>
          {Object.values(Division).map(d => (
            <button 
              key={d}
              onClick={() => setFilter(d)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === d ? DIVISION_CONFIG[d].bg + ' ' + DIVISION_CONFIG[d].color : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              {DIVISION_CONFIG[d].label}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={project.id}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                    <span className={`px-2 py-1 rounded text-xs font-bold bg-black/50 backdrop-blur-md ${DIVISION_CONFIG[project.division].color}`}>
                        {project.division}
                    </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{project.client}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-600 border border-white/10 px-2 py-1 rounded">
                        {tag}
                    </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};