import React, { useState } from 'react';
import { Film, Clock, Video } from 'lucide-react';
import { motion } from 'framer-motion';

export const VideoDurationCalculator: React.FC = () => {
  const [videoType, setVideoType] = useState('corporate');
  const [duration, setDuration] = useState('');

  const videoTypes = {
    corporate: { rate: 1200, name: 'Corporate' },
    event: { rate: 1200, name: 'Événementiel' },
    commercial: { rate: 1500, name: 'Publicitaire' },
    social: { rate: 800, name: 'Réseaux sociaux' }
  };

  const calculateCost = () => {
    const mins = parseFloat(duration) || 0;
    const rate = videoTypes[videoType as keyof typeof videoTypes].rate;
    const baseCost = mins * rate;
    const editing = baseCost * 0.3;
    const total = baseCost + editing;

    return {
      baseCost,
      editing,
      total
    };
  };

  const results = calculateCost();

  return (
    <div className="bg-[#0a0a16] border border-white/10 rounded-2xl p-8">
      <div className="flex items-center space-x-3 mb-6">
        <Film className="w-6 h-6 text-fuchsia-400" />
        <h3 className="text-2xl font-bold text-white">Calculateur Vidéo</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Type de vidéo</label>
          <select
            value={videoType}
            onChange={(e) => setVideoType(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
          >
            {Object.entries(videoTypes).map(([key, value]) => (
              <option key={key} value={key}>{value.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Durée finale souhaitée (minutes)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
            placeholder="5"
          />
        </div>

        {duration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-fuchsia-900/20 to-pink-900/20 border border-fuchsia-500/20 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Video className="w-5 h-5 text-fuchsia-400" />
              <h4 className="text-white font-bold">Estimation</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Tournage</span>
                <span className="text-white font-bold">{results.baseCost.toFixed(0)}€</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Post-production</span>
                <span className="text-white font-bold">{results.editing.toFixed(0)}€</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-fuchsia-400 font-bold">Total estimé</span>
                <span className="text-2xl font-bold text-fuchsia-400">{results.total.toFixed(0)}€</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

