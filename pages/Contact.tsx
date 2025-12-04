import React, { useState } from 'react';
import { Division, DIVISION_CONFIG } from '../types';
import { analytics } from '../utils/analytics';
import { apiService } from '../services/apiService';

export const Contact: React.FC = () => {
  const [selectedDivision, setSelectedDivision] = useState<Division>(Division.TECH);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    eventDate: '',
    objective: '',
    projectDetails: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.projectDetails) {
        setErrorMessage('Veuillez remplir tous les champs obligatoires');
        setSubmitStatus('error');
        analytics.trackFormSubmit('contact', false);
        setIsSubmitting(false);
        return;
      }

      // Create lead
      const lead = await apiService.leads.create({
        name: formData.name,
        email: formData.email,
        message: formData.projectDetails,
        interest_division: selectedDivision,
        budget: formData.budget || undefined,
        eventDate: formData.eventDate || undefined
      });

      if (lead) {
        setSubmitStatus('success');
        analytics.trackFormSubmit('contact', true);
        analytics.trackConversion('contact_form_submission');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          budget: '',
          eventDate: '',
          objective: '',
          projectDetails: ''
        });

        // Show success message for 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Une erreur s\'est produite. Veuillez réessayer.');
      setSubmitStatus('error');
      analytics.trackFormSubmit('contact', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Démarrez Votre Projet</h1>
        <p className="text-gray-400 text-lg">Dites-nous de quelle division vous avez besoin.</p>
      </div>

      <div className="bg-[#0a0a16] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
            Merci ! Votre demande a été envoyée avec succès. Nous vous répondrons sous 24h.
          </div>
        )}
        
        {submitStatus === 'error' && errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
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
                <label className="text-sm text-gray-400">Nom <span className="text-red-400">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                  placeholder="Jean Dupont"
                  required
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-gray-400">Email <span className="text-red-400">*</span></label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                  placeholder="jean@societe.com"
                  required
                />
            </div>
          </div>

          {/* Conditional Logic Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
             {selectedDivision === Division.TECH && (
                 <div className="space-y-2">
                    <label className="text-sm text-cyan-400 font-bold">Budget Estimé</label>
                    <select 
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
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
                    <input 
                      type="date" 
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    />
                 </div>
             )}
             {selectedDivision === Division.BRAND && (
                 <div className="space-y-2">
                    <label className="text-sm text-indigo-400 font-bold">Objectif Principal</label>
                    <select 
                      value={formData.objective}
                      onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="">Sélectionner un objectif</option>
                        <option value="awareness">Notoriété</option>
                        <option value="conversion">Ventes / Leads</option>
                        <option value="rebrand">Refonte Totale</option>
                    </select>
                 </div>
             )}
          </div>

          <div className="space-y-2">
             <label className="text-sm text-gray-400">Détails du Projet <span className="text-red-400">*</span></label>
             <textarea 
                rows={5} 
                value={formData.projectDetails}
                onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                placeholder={`J'ai besoin d'aide de la part de ${DIVISION_CONFIG[selectedDivision].label} concernant...`}
                required
             />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-bold text-white transition-all hover:opacity-90 bg-gradient-to-r ${DIVISION_CONFIG[selectedDivision].gradient} shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer la Demande'}
          </button>

        </form>
      </div>
    </div>
  );
};