import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Lock, User, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(username, password);
      if (result.success) {
        // Redirect to the intended destination or default to /admin
        const from = (location.state as any)?.from?.pathname || '/admin';
        navigate(from === '/devis' ? '/devis' : '/admin');
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#020205] px-6 min-h-screen">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex justify-center items-center bg-blue-600/10 mb-4 border border-blue-500/20 rounded-2xl w-16 h-16">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="mb-2 font-bold text-white text-3xl">Backoffice Aureus</h1>
          <p className="text-gray-400 text-sm">Connectez-vous pour accéder au panneau d'administration</p>
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
                <User className="top-1/2 left-3 absolute w-5 h-5 text-gray-500 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-black/30 py-3 pr-4 pl-10 border border-white/10 focus:border-blue-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
                  placeholder="admin"
                  required
                  autoFocus
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
                  className="bg-black/30 py-3 pr-4 pl-10 border border-white/10 focus:border-blue-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg w-full font-bold text-white transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                S'inscrire
              </Link>
            </p>
          </div>

          <div className="bg-white/5 mt-6 p-4 border border-white/5 rounded-lg">
            <p className="text-gray-500 text-xs text-center">
              <strong className="text-gray-400">Identifiants de test:</strong><br />
              Utilisateur: <code className="text-blue-400">admin</code><br />
              Mot de passe: <code className="text-blue-400">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

