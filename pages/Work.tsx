import React, { useState } from 'react';
import { Division, DIVISION_CONFIG, Project } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

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
  const [tagFilter, setTagFilter] = useState<string>('ALL');

  useSEO({
    title: 'Réalisations - Portfolio',
    description: 'Découvrez nos projets sélectionnés : études de cas en ingénierie, production et stratégie. Des réalisations qui transforment.',
    type: 'website'
  });

  const allTags = Array.from(new Set(MOCK_PROJECTS.flatMap(p => p.tags)));
  
  let filteredProjects = filter === 'ALL' 
    ? MOCK_PROJECTS 
    : MOCK_PROJECTS.filter(p => p.division === filter);
  
  if (tagFilter !== 'ALL') {
    filteredProjects = filteredProjects.filter(p => p.tags.includes(tagFilter));
  }

  return (
    <div className="mx-auto px-6 pt-32 max-w-7xl min-h-screen">
      <div className="flex md:flex-row flex-col justify-between items-end mb-8 pb-8 border-white/10 border-b">
        <div>
          <h1 className="mb-4 font-bold text-white text-4xl md:text-6xl">Projets Sélectionnés</h1>
          <p className="text-gray-400">Études de cas en ingénierie, production et stratégie.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-12">
        <div className="flex flex-wrap gap-2">
          <span className="self-center mr-2 font-medium text-gray-400 text-sm">Division:</span>
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
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="self-center mr-2 font-medium text-gray-400 text-sm">Tags:</span>
            <button 
              onClick={() => setTagFilter('ALL')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${tagFilter === 'ALL' ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              Tous
            </button>
            {allTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setTagFilter(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${tagFilter === tag ? 'bg-white/10 text-white border border-white/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <motion.div layout className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-20">
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={project.id}
            >
              <Link to={`/work/${project.id}`} className="group block">
                <div className="relative mb-4 rounded-lg aspect-[4/3] overflow-hidden">
                  <div className="z-10 absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors" />
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 transform"
                    loading="lazy"
                  />
                  <div className="top-4 left-4 z-20 absolute">
                      <span className={`px-2 py-1 rounded text-xs font-bold bg-black/50 backdrop-blur-md ${DIVISION_CONFIG[project.division].color}`}>
                          {project.division}
                      </span>
                  </div>
                </div>
                <h3 className="font-bold text-white group-hover:text-blue-400 text-xl transition-colors">{project.title}</h3>
                <p className="mb-2 text-gray-500 text-sm">{project.client}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 border border-white/10 rounded text-gray-600 text-xs">
                          {tag}
                      </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};