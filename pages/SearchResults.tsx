import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, FileText, Briefcase } from 'lucide-react';
import { BlogPost, Project } from '../types';
import { apiService } from '../services/apiService';
import { analytics } from '../utils/analytics';
import { useSEO } from '../hooks/useSEO';

export const SearchResults: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<{ posts: BlogPost[]; projects: Project[] }>({ posts: [], projects: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults({ posts: [], projects: [] });
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [allPosts, allProjects] = await Promise.all([
          apiService.blogPosts.getAll(),
          apiService.projects.getAll()
        ]);

        const lowerQuery = query.toLowerCase();
        
        const filteredPosts = allPosts.filter(post =>
          post.title.toLowerCase().includes(lowerQuery) ||
          post.excerpt.toLowerCase().includes(lowerQuery) ||
          post.category.toLowerCase().includes(lowerQuery) ||
          post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );

        const filteredProjects = allProjects.filter(project =>
          project.title.toLowerCase().includes(lowerQuery) ||
          project.description.toLowerCase().includes(lowerQuery) ||
          project.client.toLowerCase().includes(lowerQuery) ||
          project.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );

        setResults({
          posts: filteredPosts,
          projects: filteredProjects
        });

        analytics.trackSearch(query, filteredPosts.length + filteredProjects.length);
      } catch (error) {
        console.error('Search error:', error);
        setResults({ posts: [], projects: [] });
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  useSEO({
    title: query ? `Recherche : ${query}` : 'Recherche',
    description: `Résultats de recherche pour "${query}"`,
    type: 'website'
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Recherche en cours...</p>
        </div>
      </div>
    );
  }

  const totalResults = results.posts.length + results.projects.length;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="w-6 h-6 text-blue-400" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Résultats de recherche
          </h1>
        </div>
        {query && (
          <p className="text-gray-400">
            {totalResults > 0 ? (
              <>
                {totalResults} résultat{totalResults > 1 ? 's' : ''} pour <span className="text-white font-medium">"{query}"</span>
              </>
            ) : (
              <>Aucun résultat pour <span className="text-white font-medium">"{query}"</span></>
            )}
          </p>
        )}
      </div>

      {totalResults === 0 ? (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Aucun résultat trouvé</h2>
          <p className="text-gray-400 mb-8">
            Essayez avec d'autres mots-clés ou explorez nos contenus
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/blog"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
            >
              Voir le blog
            </Link>
            <Link
              to="/work"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-colors"
            >
              Voir les projets
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {results.posts.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <FileText className="w-5 h-5 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">
                  Articles ({results.posts.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.posts.map(post => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group block bg-[#0a0a16] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
                  >
                    <div className="text-gray-500 text-xs mb-2">{post.date}</div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.projects.length > 0 && (
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">
                  Projets ({results.projects.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.projects.map(project => (
                  <Link
                    key={project.id}
                    to={`/work/${project.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4 border border-white/10">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500">{project.client}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

