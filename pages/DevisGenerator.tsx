import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Division, DIVISION_CONFIG } from '../types';
import { generateDevis, DevisGenerationParams } from '../services/geminiService';
import { FileText, Loader2, Download, Copy, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DevisGenerator: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<DevisGenerationParams>({
    clientName: '',
    clientEmail: user?.email || '',
    companyName: '',
    division: Division.TECH,
    projectDescription: '',
    budget: '',
    deadline: '',
    additionalRequirements: '',
  });
  const [generatedDevis, setGeneratedDevis] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: keyof DevisGenerationParams, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGeneratedDevis('');

    if (!formData.clientName || !formData.clientEmail || !formData.projectDescription) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsGenerating(true);
    try {
      const devis = await generateDevis(formData);
      setGeneratedDevis(devis);
    } catch (err) {
      setError('Erreur lors de la génération du devis. Veuillez réessayer.');
      console.error('Devis generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (generatedDevis) {
      await navigator.clipboard.writeText(generatedDevis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedDevis) {
      const blob = new Blob([generatedDevis], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `devis-${formData.clientName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex justify-center items-center bg-gradient-to-r from-cyan-500/10 to-blue-600/10 mb-4 border border-cyan-500/20 rounded-2xl w-16 h-16">
          <Sparkles className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Générateur de Devis IA</h1>
        <p className="text-gray-400 text-lg">Créez un devis professionnel personnalisé en quelques secondes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-[#0a0a16] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="mb-6 font-bold text-white text-xl flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Informations du Projet</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 p-3 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block font-medium text-gray-400 text-sm">
                Division <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {Object.values(Division).map((div) => (
                  <button
                    key={div}
                    type="button"
                    onClick={() => handleInputChange('division', div)}
                    className={`p-3 rounded-xl border transition-all duration-300 text-center text-sm font-medium
                      ${formData.division === div
                        ? `bg-white/5 ${DIVISION_CONFIG[div].border} ${DIVISION_CONFIG[div].color} border-2`
                        : 'border-white/5 text-gray-500 hover:border-white/20'
                      }`}
                  >
                    {DIVISION_CONFIG[div].label.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium text-gray-400 text-sm">
                  Nom du client <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className="bg-black/30 py-3 px-4 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
                  placeholder="Jean Dupont"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium text-gray-400 text-sm">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                  className="bg-black/30 py-3 px-4 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
                  placeholder="jean@societe.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-400 text-sm">
                Nom de l'entreprise (optionnel)
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="bg-black/30 py-3 px-4 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
                placeholder="Société SARL"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-400 text-sm">
                Description du projet <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={5}
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                className="bg-black/30 py-3 px-4 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500 resize-none"
                placeholder={`Décrivez votre projet en détail...`}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-medium text-gray-400 text-sm">
                  Budget estimé (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="bg-black/30 py-3 px-4 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
                  placeholder="5 000€ - 10 000€"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium text-gray-400 text-sm">
                  Délai souhaité (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className="bg-black/30 py-3 px-4 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
                  placeholder="3-4 semaines"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-gray-400 text-sm">
                Exigences supplémentaires (optionnel)
              </label>
              <textarea
                rows={3}
                value={formData.additionalRequirements}
                onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                className="bg-black/30 py-3 px-4 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500 resize-none"
                placeholder="Autres informations importantes..."
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full py-4 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${DIVISION_CONFIG[formData.division as Division].gradient} shadow-lg hover:shadow-xl flex items-center justify-center space-x-2`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Génération en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Générer le Devis</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated Devis Section */}
        <div className="bg-[#0a0a16] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-white text-xl flex items-center space-x-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Devis Généré</span>
            </h2>
            {generatedDevis && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  title="Copier"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-gray-400"
              >
                <Loader2 className="w-12 h-12 mb-4 animate-spin text-cyan-400" />
                <p>Génération du devis en cours...</p>
                <p className="mt-2 text-gray-500 text-sm">Cela peut prendre quelques secondes</p>
              </motion.div>
            ) : generatedDevis ? (
              <motion.div
                key="devis"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-black/20 p-6 border border-white/5 rounded-lg max-h-[600px] overflow-y-auto"
              >
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                  {generatedDevis}
                </pre>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-gray-500"
              >
                <FileText className="w-16 h-16 mb-4 opacity-20" />
                <p>Remplissez le formulaire et cliquez sur "Générer le Devis"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

