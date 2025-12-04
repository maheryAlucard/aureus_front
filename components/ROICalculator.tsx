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
    <div className="bg-[#0a0a16] border border-white/10 rounded-2xl p-8">
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="w-6 h-6 text-cyan-400" />
        <h3 className="text-2xl font-bold text-white">Calculateur de ROI</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Revenus mensuels (€)</label>
          <input
            type="number"
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="10000"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Heures automatisées par mois</label>
          <input
            type="number"
            value={automationHours}
            onChange={(e) => setAutomationHours(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="20"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Taux horaire (€)</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {(monthlyRevenue || automationHours) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/20 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h4 className="text-white font-bold">Résultats</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-xs mb-1">Économies mensuelles</div>
                <div className="text-2xl font-bold text-cyan-400">{results.monthlySavings.toFixed(0)}€</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Économies annuelles</div>
                <div className="text-2xl font-bold text-blue-400">{results.annualSavings.toFixed(0)}€</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">ROI</div>
                <div className="text-2xl font-bold text-green-400">{results.roi}%</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">Retour sur investissement</div>
                <div className="text-2xl font-bold text-purple-400">{results.paybackMonths} mois</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

