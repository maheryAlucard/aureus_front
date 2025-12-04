import React, { useState } from 'react';
import { Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    id: 1,
    question: 'Avez-vous une identité visuelle cohérente ?',
    options: ['Oui, complète', 'Partiellement', 'Non']
  },
  {
    id: 2,
    question: 'Votre présence sur les réseaux sociaux est-elle active ?',
    options: ['Très active', 'Modérée', 'Inexistante']
  },
  {
    id: 3,
    question: 'Avez-vous une stratégie de contenu définie ?',
    options: ['Oui, claire', 'En développement', 'Non']
  }
];

export const BrandAuditQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
    }
  };

  const getScore = () => {
    const total = answers.reduce((sum, ans) => sum + (ans === 0 ? 3 : ans === 1 ? 2 : 1), 0);
    const maxScore = QUESTIONS.length * 3;
    return Math.round((total / maxScore) * 100);
  };

  const getRecommendation = () => {
    const score = getScore();
    if (score >= 80) {
      return {
        title: 'Excellent !',
        message: 'Votre marque est bien positionnée. Nous pouvons vous aider à optimiser encore plus.',
        color: 'text-green-400'
      };
    } else if (score >= 50) {
      return {
        title: 'Bon potentiel',
        message: 'Votre marque a des bases solides. Quelques améliorations stratégiques pourraient faire la différence.',
        color: 'text-yellow-400'
      };
    } else {
      return {
        title: 'Besoin d\'amélioration',
        message: 'Votre marque a besoin d\'un audit complet et d\'une stratégie de rebranding.',
        color: 'text-red-400'
      };
    }
  };

  if (completed) {
    const recommendation = getRecommendation();
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0a0a16] p-8 border border-white/10 rounded-2xl text-center"
      >
        <div className="mb-6">
          <div className="inline-flex justify-center items-center bg-gradient-to-r from-indigo-500/10 to-violet-500/10 mb-4 border border-indigo-500/20 rounded-2xl w-16 h-16">
            <CheckCircle2 className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="mb-2 font-bold text-white text-2xl">Audit terminé</h3>
          <div className="mb-4 font-bold text-indigo-400 text-4xl">{getScore()}%</div>
          <p className={`text-lg font-bold mb-2 ${recommendation.color}`}>{recommendation.title}</p>
          <p className="text-gray-400">{recommendation.message}</p>
        </div>
        <button
          onClick={() => {
            setCurrentQuestion(0);
            setAnswers([]);
            setCompleted(false);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-bold text-white transition-colors"
        >
          Recommencer
        </button>
      </motion.div>
    );
  }

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="bg-[#0a0a16] p-8 border border-white/10 rounded-2xl">
      <div className="flex items-center space-x-3 mb-6">
        <Zap className="w-6 h-6 text-indigo-400" />
        <h3 className="font-bold text-white text-2xl">Audit de Marque</h3>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">Question {currentQuestion + 1} sur {QUESTIONS.length}</span>
          <span className="text-gray-400 text-sm">{Math.round(progress)}%</span>
        </div>
        <div className="bg-white/5 rounded-full w-full h-2">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full h-2"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h4 className="mb-6 font-bold text-white text-xl">{question.question}</h4>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="group bg-white/5 hover:bg-white/10 p-4 border border-white/10 hover:border-indigo-500/50 rounded-lg w-full text-left transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 group-hover:text-white">{option}</span>
                  <ArrowRight className="opacity-0 group-hover:opacity-100 w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

