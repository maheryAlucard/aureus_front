import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost, Project } from '../types';
import { apiService } from '../services/apiService';
import { analytics } from '../utils/analytics';

interface SearchBarProps {
  variant?: 'default' | 'compact';
  onClose?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ variant = 'default', onClose }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{ posts: BlogPost[]; projects: Project[] }>({ posts: [], projects: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ posts: [], projects: [] });
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const [allPosts, allProjects] = await Promise.all([
        apiService.blogPosts.getAll(),
        apiService.projects.getAll()
      ]);

      const lowerQuery = searchQuery.toLowerCase();
      
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
        posts: filteredPosts.slice(0, 5),
        projects: filteredProjects.slice(0, 5)
      });

      analytics.trackSearch(searchQuery, filteredPosts.length + filteredProjects.length);
    } catch (error) {
      console.error('Search error:', error);
      setResults({ posts: [], projects: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  const handleResultClick = (type: 'post' | 'project', id: string, slug?: string) => {
    if (type === 'post' && slug) {
      navigate(`/blog/${slug}`);
    } else if (type === 'project') {
      navigate(`/work/${id}`);
    }
    setQuery('');
    setResults({ posts: [], projects: [] });
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      if (onClose) onClose();
    } else if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <div className="relative">
          <Search className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher..."
            className="bg-white/5 py-2 pr-10 pl-10 border border-white/10 focus:border-blue-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults({ posts: [], projects: [] });
                setHasSearched(false);
              }}
              className="top-1/2 right-3 absolute text-gray-400 hover:text-white -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isOpen && (query || hasSearched) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="top-full right-0 left-0 z-50 absolute bg-[#0a0a16] shadow-2xl mt-2 border border-white/10 rounded-xl max-h-96 overflow-y-auto"
            >
              {isSearching ? (
                <div className="p-8 text-center">
                  <Loader2 className="mx-auto mb-2 w-6 h-6 text-blue-400 animate-spin" />
                  <p className="text-gray-400 text-sm">Recherche en cours...</p>
                </div>
              ) : results.posts.length === 0 && results.projects.length === 0 && hasSearched ? (
                <div className="p-8 text-center">
                  <p className="text-gray-400">Aucun résultat trouvé</p>
                </div>
              ) : (
                <div className="p-4">
                  {results.posts.length > 0 && (
                    <div className="mb-4">
                      <h3 className="mb-2 px-2 font-bold text-gray-500 text-xs uppercase tracking-wider">
                        Articles ({results.posts.length})
                      </h3>
                      {results.posts.map(post => (
                        <button
                          key={post.id}
                          onClick={() => handleResultClick('post', post.id, post.slug)}
                          className="hover:bg-white/5 mb-1 p-3 rounded-lg w-full text-left transition-colors"
                        >
                          <div className="mb-1 font-medium text-white text-sm">{post.title}</div>
                          <div className="text-gray-400 text-xs line-clamp-1">{post.excerpt}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {results.projects.length > 0 && (
                    <div>
                      <h3 className="mb-2 px-2 font-bold text-gray-500 text-xs uppercase tracking-wider">
                        Projets ({results.projects.length})
                      </h3>
                      {results.projects.map(project => (
                        <button
                          key={project.id}
                          onClick={() => handleResultClick('project', project.id)}
                          className="hover:bg-white/5 mb-1 p-3 rounded-lg w-full text-left transition-colors"
                        >
                          <div className="mb-1 font-medium text-white text-sm">{project.title}</div>
                          <div className="text-gray-400 text-xs line-clamp-1">{project.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {query && (results.posts.length > 0 || results.projects.length > 0) && (
                    <button
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(query)}`);
                        setIsOpen(false);
                        if (onClose) onClose();
                      }}
                      className="bg-white/5 hover:bg-white/10 mt-4 p-3 border border-white/10 rounded-lg w-full font-medium text-white text-sm transition-colors"
                    >
                      Voir tous les résultats
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="top-1/2 left-4 absolute w-5 h-5 text-gray-400 -translate-y-1/2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher des articles, projets..."
          className="bg-white/5 py-3 pr-12 pl-12 border border-white/10 focus:border-blue-500 rounded-lg focus:outline-none w-full text-white transition-colors placeholder-gray-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults({ posts: [], projects: [] });
              setHasSearched(false);
            }}
            className="top-1/2 right-4 absolute text-gray-400 hover:text-white -translate-y-1/2"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query || hasSearched) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="top-full right-0 left-0 z-50 absolute bg-[#0a0a16] shadow-2xl mt-2 border border-white/10 rounded-xl max-h-96 overflow-y-auto"
          >
            {isSearching ? (
              <div className="p-8 text-center">
                <Loader2 className="mx-auto mb-2 w-6 h-6 text-blue-400 animate-spin" />
                <p className="text-gray-400 text-sm">Recherche en cours...</p>
              </div>
            ) : results.posts.length === 0 && results.projects.length === 0 && hasSearched ? (
              <div className="p-8 text-center">
                <p className="text-gray-400">Aucun résultat trouvé</p>
              </div>
            ) : (
              <div className="p-4">
                {results.posts.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 px-2 font-bold text-gray-500 text-xs uppercase tracking-wider">
                      Articles ({results.posts.length})
                    </h3>
                    {results.posts.map(post => (
                      <button
                        key={post.id}
                        onClick={() => handleResultClick('post', post.id, post.slug)}
                        className="hover:bg-white/5 mb-1 p-3 rounded-lg w-full text-left transition-colors"
                      >
                        <div className="mb-1 font-medium text-white text-sm">{post.title}</div>
                        <div className="text-gray-400 text-xs line-clamp-1">{post.excerpt}</div>
                      </button>
                    ))}
                  </div>
                )}
                {results.projects.length > 0 && (
                  <div>
                    <h3 className="mb-2 px-2 font-bold text-gray-500 text-xs uppercase tracking-wider">
                      Projets ({results.projects.length})
                    </h3>
                    {results.projects.map(project => (
                      <button
                        key={project.id}
                        onClick={() => handleResultClick('project', project.id)}
                        className="hover:bg-white/5 mb-1 p-3 rounded-lg w-full text-left transition-colors"
                      >
                        <div className="mb-1 font-medium text-white text-sm">{project.title}</div>
                        <div className="text-gray-400 text-xs line-clamp-1">{project.description}</div>
                      </button>
                    ))}
                  </div>
                )}
                {query && (results.posts.length > 0 || results.projects.length > 0) && (
                  <button
                    onClick={() => {
                      navigate(`/search?q=${encodeURIComponent(query)}`);
                      setIsOpen(false);
                      if (onClose) onClose();
                    }}
                    className="bg-white/5 hover:bg-white/10 mt-4 p-3 border border-white/10 rounded-lg w-full font-medium text-white text-sm transition-colors"
                  >
                    Voir tous les résultats
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

