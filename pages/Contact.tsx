import React, { useState } from 'react';
import { Division, DIVISION_CONFIG } from '../types';

export const Contact: React.FC = () => {
  const [selectedDivision, setSelectedDivision] = useState<Division>(Division.TECH);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Démarrez Votre Projet</h1>
        <p className="text-gray-400 text-lg">Dites-nous de quelle division vous avez besoin.</p>
      </div>

      <div className="bg-[#0a0a16] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
        <form className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(Division).map((div) => (
              <div 
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center text-center gap-2
                  ${selectedDivision === div 
                    ? `bg-white/5 ${DIVISION_CONFIG[div].border} ${DIVISION_CONFIG[div].color}` 
                    : 'border-white/5 text-gray-500 hover:border-white/20'
                  }`}
              >
                <div className="font-bold">{DIVISION_CONFIG[div].label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm text-gray-400">Nom</label>
                <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Jean Dupont" />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-gray-400">Email</label>
                <input type="email" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="jean@societe.com" />
            </div>
          </div>

          {/* Conditional Logic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
             {selectedDivision === Division.TECH && (
                 <div className="space-y-2">
                    <label className="text-sm text-cyan-400 font-bold">Budget Estimé</label>
                    <select className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                        <option value="">Sélectionner une fourchette</option>
                        <option value="low">2k€ - 5k€ (MVP)</option>
                        <option value="mid">5k€ - 15k€ (Projet Complet)</option>
                        <option value="high">15k€+ (Enterprise)</option>
                    </select>
                 </div>
             )}
             {selectedDivision === Division.STUDIO && (
                 <div className="space-y-2">
                    <label className="text-sm text-fuchsia-400 font-bold">Date de l'Événement / Tournage</label>
                    <input type="date" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                 </div>
             )}
             {selectedDivision === Division.BRAND && (
                 <div className="space-y-2">
                    <label className="text-sm text-indigo-400 font-bold">Objectif Principal</label>
                    <select className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
                        <option value="">Sélectionner un objectif</option>
                        <option value="awareness">Notoriété</option>
                        <option value="conversion">Ventes / Leads</option>
                        <option value="rebrand">Refonte Totale</option>
                    </select>
                 </div>
             )}
          </div>

          <div className="space-y-2">
             <label className="text-sm text-gray-400">Détails du Projet</label>
             <textarea 
                rows={5} 
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder={`J'ai besoin d'aide de la part de ${DIVISION_CONFIG[selectedDivision].label} concernant...`} 
             />
          </div>

          <button className={`w-full py-4 rounded-lg font-bold text-white transition-all hover:opacity-90 bg-gradient-to-r ${DIVISION_CONFIG[selectedDivision].gradient} shadow-lg hover:shadow-xl`}>
            Envoyer la Demande
          </button>

        </form>
      </div>
    </div>
  );
};