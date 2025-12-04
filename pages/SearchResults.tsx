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
      <div className="flex justify-center items-center px-6 pt-32 pb-20 min-h-screen">
        <div className="text-center">
          <div className="mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin" />
          <p className="text-gray-400">Recherche en cours...</p>
        </div>
      </div>
    );
  }

  const totalResults = results.posts.length + results.projects.length;

  return (
    <div className="mx-auto px-6 pt-32 pb-20 max-w-7xl min-h-screen">
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="w-6 h-6 text-blue-400" />
          <h1 className="font-bold text-white text-3xl md:text-4xl">
            Résultats de recherche
          </h1>
        </div>
        {query && (
          <p className="text-gray-400">
            {totalResults > 0 ? (
              <>
                {totalResults} résultat{totalResults > 1 ? 's' : ''} pour <span className="font-medium text-white">"{query}"</span>
              </>
            ) : (
              <>Aucun résultat pour <span className="font-medium text-white">"{query}"</span></>
            )}
          </p>
        )}
      </div>

      {totalResults === 0 ? (
        <div className="py-20 text-center">
          <Search className="mx-auto mb-4 w-16 h-16 text-gray-600" />
          <h2 className="mb-2 font-bold text-white text-2xl">Aucun résultat trouvé</h2>
          <p className="mb-8 text-gray-400">
            Essayez avec d'autres mots-clés ou explorez nos contenus
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/blog"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium text-white transition-colors"
            >
              Voir le blog
            </Link>
            <Link
              to="/work"
              className="bg-white/5 hover:bg-white/10 px-6 py-3 border border-white/10 rounded-lg font-medium text-white transition-colors"
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
                <h2 className="font-bold text-white text-2xl">
                  Articles ({results.posts.length})
                </h2>
              </div>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {results.posts.map(post => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group block bg-[#0a0a16] p-6 border border-white/10 hover:border-white/20 rounded-xl transition-all"
                  >
                    <div className="mb-2 text-gray-500 text-xs">{post.date}</div>
                    <h3 className="mb-2 font-bold text-white group-hover:text-blue-400 text-xl transition-colors">
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
                <h2 className="font-bold text-white text-2xl">
                  Projets ({results.projects.length})
                </h2>
              </div>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {results.projects.map(project => (
                  <Link
                    key={project.id}
                    to={`/work/${project.id}`}
                    className="group block"
                  >
                    <div className="relative mb-4 border border-white/10 rounded-lg aspect-[4/3] overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="mb-2 font-bold text-white group-hover:text-blue-400 text-xl transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{project.client}</p>
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

