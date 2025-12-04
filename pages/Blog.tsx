import React, { useState } from 'react';
import { BlogPost, Division, DIVISION_CONFIG } from '../types';
import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { SocialShareCompact } from '../components/SocialShare';

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
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    
    useSEO({
        title: 'Knowledge Hub - Blog',
        description: 'Analyses, tutoriels et pensées sur le futur du digital. Découvrez nos réflexions sur la tech, la créativité et le marketing.',
        type: 'website'
    });

    const categories = ['ALL', ...Array.from(new Set(MOCK_POSTS.map(p => p.category)))];
    const filteredPosts = selectedCategory === 'ALL' 
        ? MOCK_POSTS 
        : MOCK_POSTS.filter(p => p.category === selectedCategory);

    return (
        <div className="mx-auto px-6 pt-32 pb-20 max-w-7xl min-h-screen">
            <div className="flex md:flex-row flex-col justify-between items-end mb-8 pb-8 border-white/10 border-b">
                <div>
                    <h1 className="mb-4 font-bold text-white text-4xl md:text-6xl">Knowledge Hub</h1>
                    <p className="text-gray-400">Analyses, tutoriels et pensées sur le futur du digital.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-12">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === category
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                    <div key={post.id} className="group">
                        <Link to={`/blog/${post.slug}`} className="block">
                            <div className="relative mb-4 border border-white/10 rounded-xl aspect-video overflow-hidden">
                                <img 
                                    src={post.imageUrl} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="top-4 left-4 absolute bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10 rounded-full font-bold text-white text-xs">
                                    {post.category}
                                </div>
                            </div>
                            <div className="mb-2 text-gray-500 text-xs">{post.date}</div>
                            <h3 className="mb-2 font-bold text-white group-hover:text-blue-400 text-xl leading-tight transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-2">
                                {post.excerpt}
                            </p>
                        </Link>
                        <div className="mt-4">
                            <SocialShareCompact
                                title={post.title}
                                description={post.excerpt}
                                contentType="blog"
                                contentId={post.id}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};