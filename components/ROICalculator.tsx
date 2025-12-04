import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export const ROICalculator: React.FC = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [automationHours, setAutomationHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('50');

  const calculateROI = () => {
    const revenue = parseFloat(monthlyRevenue) || 0;
    const hours = parseFloat(automationHours) || 0;
    const rate = parseFloat(hourlyRate) || 50;

    const monthlySavings = hours * rate;
    const annualSavings = monthlySavings * 12;
    const roi = revenue > 0 ? ((annualSavings / revenue) * 100).toFixed(1) : 0;
    const paybackMonths = revenue > 0 ? (revenue / monthlySavings).toFixed(1) : 0;

    return {
      monthlySavings,
      annualSavings,
      roi,
      paybackMonths
    };
  };

  const results = calculateROI();

  return (
    <div className="bg-[#0a0a16] p-8 border border-white/10 rounded-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="w-6 h-6 text-cyan-400" />
        <h3 className="font-bold text-white text-2xl">Calculateur de ROI</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-gray-400 text-sm">Revenus mensuels (€)</label>
          <input
            type="number"
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(e.target.value)}
            className="bg-black/20 px-4 py-3 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors"
            placeholder="10000"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-400 text-sm">Heures automatisées par mois</label>
          <input
            type="number"
            value={automationHours}
            onChange={(e) => setAutomationHours(e.target.value)}
            className="bg-black/20 px-4 py-3 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors"
            placeholder="20"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-400 text-sm">Taux horaire (€)</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="bg-black/20 px-4 py-3 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors"
          />
        </div>

        {(monthlyRevenue || automationHours) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-6 border border-cyan-500/20 rounded-xl"
          >
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h4 className="font-bold text-white">Résultats</h4>
            </div>
            <div className="gap-4 grid grid-cols-2">
              <div>
                <div className="mb-1 text-gray-400 text-xs">Économies mensuelles</div>
                <div className="font-bold text-cyan-400 text-2xl">{results.monthlySavings.toFixed(0)}€</div>
              </div>
              <div>
                <div className="mb-1 text-gray-400 text-xs">Économies annuelles</div>
                <div className="font-bold text-blue-400 text-2xl">{results.annualSavings.toFixed(0)}€</div>
              </div>
              <div>
                <div className="mb-1 text-gray-400 text-xs">ROI</div>
                <div className="font-bold text-green-400 text-2xl">{results.roi}%</div>
              </div>
              <div>
                <div className="mb-1 text-gray-400 text-xs">Retour sur investissement</div>
                <div className="font-bold text-purple-400 text-2xl">{results.paybackMonths} mois</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

