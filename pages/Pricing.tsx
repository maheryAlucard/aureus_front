import React from 'react';
import { Division, DIVISION_CONFIG } from '../types';
import { Check } from 'lucide-react';

const PACKAGES = [
    {
        title: "Starter Web",
        division: Division.TECH,
        price: "2,500€",
        features: ["Site Vitrine Next.js", "SEO de base", "Hébergement configuré", "Design Responsive"]
    },
    {
        title: "Pack Créateur",
        division: Division.STUDIO,
        price: "1,200€ / jour",
        features: ["Tournage 4K", "Étalonnage Cinéma", "Montage Réseaux Sociaux", "Drone inclus"],
        highlight: true
    },
    {
        title: "Croissance",
        division: Division.BRAND,
        price: "1,500€ / mois",
        features: ["Gestion Social Media", "3 Posts / semaine", "Rapport Mensuel", "Design Graphique illimité"]
    }
];

export const Pricing: React.FC = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Accélérateur Startup</h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Des tarifs transparents conçus pour les entreprises agiles. Pas de coûts cachés, juste de la valeur.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PACKAGES.map((pkg, idx) => (
                    <div 
                        key={idx} 
                        className={`relative bg-[#0a0a16] border rounded-2xl p-8 flex flex-col ${pkg.highlight ? 'border-purple-500 shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]' : 'border-white/10 hover:border-white/20'} transition-all duration-300`}
                    >
                        {pkg.highlight && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">
                                Populaire
                            </div>
                        )}
                        <div className={`text-xs font-bold tracking-widest mb-2 ${DIVISION_CONFIG[pkg.division].color}`}>
                            {DIVISION_CONFIG[pkg.division].label.toUpperCase()}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">{pkg.title}</h3>
                        <div className="text-4xl font-bold text-white mb-6">{pkg.price}</div>
                        
                        <ul className="space-y-4 mb-8 flex-1">
                            {pkg.features.map((feat, i) => (
                                <li key={i} className="flex items-start space-x-3 text-gray-400 text-sm">
                                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <button className={`w-full py-3 rounded-lg font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors`}>
                            Choisir ce Pack
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-20 p-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 rounded-2xl text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Besoin d'une solution sur mesure ?</h3>
                <p className="text-gray-400 mb-6">Nous créons des devis personnalisés pour les projets complexes d'architecture SaaS ou les productions vidéo long-métrage.</p>
                <a href="#/contact" className="inline-block bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                    Contacter l'équipe
                </a>
            </div>
        </div>
    );
};