import React from 'react';
import { Hexagon, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020205] border-t border-white/5 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Hexagon className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
            <span className="text-lg font-bold tracking-widest text-white">AUREUS</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            La rencontre du code et de l'art pour bâtir la prochaine génération d'infrastructures digitales.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Divisions</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-cyan-400 cursor-pointer transition-colors">Aureus Tech</li>
            <li className="hover:text-fuchsia-400 cursor-pointer transition-colors">Aureus Studio</li>
            <li className="hover:text-indigo-400 cursor-pointer transition-colors">Aureus Brand</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Entreprise</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer transition-colors">À propos</li>
            <li className="hover:text-white cursor-pointer transition-colors">Carrières</li>
            <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
            <li className="hover:text-white cursor-pointer transition-colors">Tarifs</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Réseaux</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
      
      {/* SEO Cloud (Subtle/Hidden for aesthetics but present for semantics) */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5">
        <div className="flex flex-wrap gap-2 justify-center opacity-10 text-[10px] text-gray-500 select-none">
           <span>Développement Web Paris</span> • <span>Agence IA</span> • <span>Production Vidéo Mariage</span> • 
           <span>Agence Branding Startup</span> • <span>Développement App Mobile</span> • <span>Montage Vidéo Corporate</span> • 
           <span>Automatisation Business</span> • <span>Transformation Digitale</span> • <span>Design UX/UI</span>
        </div>
        <div className="text-center text-xs text-gray-600 mt-4">
          &copy; {new Date().getFullYear()} Agence Digitale Aureus. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};