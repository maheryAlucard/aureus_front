import React from 'react';
import { Hexagon, Github, Twitter, Linkedin } from 'lucide-react';
import { NewsletterSignup } from './NewsletterSignup';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020205] py-12 md:py-20 border-white/5 border-t">
      <div className="gap-12 grid grid-cols-1 md:grid-cols-4 mx-auto px-6 max-w-7xl">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center space-x-2">
            <Hexagon className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
            <span className="font-bold text-white text-lg tracking-widest">AUREUS</span>
          </div>
          <p className="mb-6 text-gray-400 text-sm leading-relaxed">
            La rencontre du code et de l'art pour bâtir la prochaine génération d'infrastructures digitales.
          </p>
          <div>
            <h4 className="mb-3 font-bold text-white">Newsletter</h4>
            <NewsletterSignup variant="compact" source="footer" />
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">Divisions</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-cyan-400 transition-colors cursor-pointer">Aureus Tech</li>
            <li className="hover:text-fuchsia-400 transition-colors cursor-pointer">Aureus Studio</li>
            <li className="hover:text-indigo-400 transition-colors cursor-pointer">Aureus Brand</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">Entreprise</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white transition-colors cursor-pointer">À propos</li>
            <li className="hover:text-white transition-colors cursor-pointer">Carrières</li>
            <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
            <li className="hover:text-white transition-colors cursor-pointer">Tarifs</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold text-white">Réseaux</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
      
      {/* SEO Cloud (Subtle/Hidden for aesthetics but present for semantics) */}
      <div className="mx-auto mt-12 px-6 pt-8 border-white/5 border-t max-w-7xl">
        <div className="flex flex-wrap justify-center gap-2 opacity-10 text-[10px] text-gray-500 select-none">
           <span>Développement Web Paris</span> • <span>Agence IA</span> • <span>Production Vidéo Mariage</span> • 
           <span>Agence Branding Startup</span> • <span>Développement App Mobile</span> • <span>Montage Vidéo Corporate</span> • 
           <span>Automatisation Business</span> • <span>Transformation Digitale</span> • <span>Design UX/UI</span>
        </div>
        <div className="mt-4 text-gray-600 text-xs text-center">
          &copy; {new Date().getFullYear()} Agence Digitale Aureus. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};