import React from 'react';
import { BlogPost, Division, DIVISION_CONFIG } from '../types';
import { Link } from 'react-router-dom';

const MOCK_POSTS: BlogPost[] = [
    {
        id: '1',
        title: 'Comment les agents IA remplacent le support traditionnel',
        excerpt: 'L\'automatisation n\'est pas le futur, c\'est le présent. Découvrez comment réduire vos coûts de 40%.',
        category: 'Tendances Tech',
        date: '12 Oct 2023',
        imageUrl: 'https://picsum.photos/seed/ai/800/600',
        slug: 'ai-agents-support'
    },
    {
        id: '2',
        title: 'Pourquoi l\'étalonnage compte pour votre image de marque',
        excerpt: 'La psychologie des couleurs au cinéma appliquée au branding d\'entreprise.',
        category: 'Coin Créateur',
        date: '08 Oct 2023',
        imageUrl: 'https://picsum.photos/seed/color/800/600',
        slug: 'color-grading-brand'
    },
    {
        id: '3',
        title: 'Next.js 14 : Ce qui change pour votre site web',
        excerpt: 'Performance, SEO et Server Actions. Pourquoi migrer maintenant.',
        category: 'Ingénierie',
        date: '01 Oct 2023',
        imageUrl: 'https://picsum.photos/seed/next/800/600',
        slug: 'nextjs-14-update'
    }
];

export const Blog: React.FC = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Knowledge Hub</h1>
                    <p className="text-gray-400">Analyses, tutoriels et pensées sur le futur du digital.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MOCK_POSTS.map((post) => (
                    <div key={post.id} className="group cursor-pointer">
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                            <img 
                                src={post.imageUrl} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                {post.category}
                            </div>
                        </div>
                        <div className="text-gray-500 text-xs mb-2">{post.date}</div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-tight">
                            {post.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                            {post.excerpt}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};