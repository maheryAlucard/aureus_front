import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col justify-center items-center bg-[#020205] px-6 min-h-screen">
            <div className="text-center">
                <h1 className="mb-4 font-bold text-white text-6xl md:text-8xl">404</h1>
                <h2 className="mb-6 font-bold text-gray-300 text-2xl md:text-3xl">
                    Page non trouvée
                </h2>
                <p className="mx-auto mb-8 max-w-md text-gray-400 text-lg">
                    La page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] px-6 py-3 rounded-full font-bold text-white transition-all"
                >
                    <Home className="w-5 h-5" />
                    <span>Retour à l'accueil</span>
                </Link>
            </div>
        </div>
    );
};

