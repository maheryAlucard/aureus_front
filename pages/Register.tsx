import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, Mail, Lock, AlertCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const result = await register(username, email, password);
      if (result.success) {
        // Redirect to the intended destination or default to /devis
        const from = (location.state as any)?.from?.pathname || '/devis';
        navigate(from);
      } else {
        setError(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#020205] px-6 min-h-screen">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex justify-center items-center bg-cyan-600/10 mb-4 border border-cyan-500/20 rounded-2xl w-16 h-16">
            <UserPlus className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="mb-2 font-bold text-white text-3xl">Créer un compte</h1>
          <p className="text-gray-400 text-sm">Inscrivez-vous pour générer des devis personnalisés</p>
        </div>

        <div className="bg-[#0a0a16] shadow-2xl p-8 border border-white/10 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 bg-red-500/10 p-3 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="block mb-2 font-medium text-gray-400 text-sm">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <UserPlus className="top-1/2 left-3 absolute w-5 h-5 text-gray-500 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/30 py-3 pr-4 pl-10 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
                  placeholder="Votre nom d'utilisateur"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block mb-2 font-medium text-gray-400 text-sm">
                Email
              </label>
              <div className="relative">
                <Mail className="top-1/2 left-3 absolute w-5 h-5 text-gray-500 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/30 py-3 pr-4 pl-10 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block mb-2 font-medium text-gray-400 text-sm">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="top-1/2 left-3 absolute w-5 h-5 text-gray-500 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/30 py-3 pr-4 pl-10 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block mb-2 font-medium text-gray-400 text-sm">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="top-1/2 left-3 absolute w-5 h-5 text-gray-500 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-black/30 py-3 pr-4 pl-10 border border-white/10 focus:border-cyan-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="bg-gradient-to-r from-cyan-500 hover:from-cyan-400 to-blue-600 hover:to-blue-500 disabled:opacity-50 py-3 rounded-lg w-full font-bold text-white transition-all disabled:cursor-not-allowed"
            >
              {authLoading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Vous avez déjà un compte ?{' '}
              <Link to="/devis" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                Accéder au générateur de devis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

