import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types';
import { apiService } from '../services/apiService';
import { useSEO } from '../hooks/useSEO';
import { SocialShare } from '../components/SocialShare';
import { analytics } from '../utils/analytics';
import { LeadMagnet } from '../components/LeadMagnet';
import { ReadingProgress } from '../components/ReadingProgress';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const allPosts = await apiService.blogPosts.getAll();
        const foundPost = allPosts.find(p => p.slug === slug);
        
        if (foundPost) {
          // Generate full content if not present
          const fullPost: BlogPostType = {
            ...foundPost,
            content: foundPost.content || generateMockContent(foundPost),
            readingTime: foundPost.readingTime || calculateReadingTime(foundPost.content || generateMockContent(foundPost)),
            tags: foundPost.tags || [foundPost.category]
          };
          setPost(fullPost);
          
          // Find related posts
          const related = allPosts
            .filter(p => p.id !== foundPost.id && (p.category === foundPost.category || p.tags?.some(t => foundPost.tags?.includes(t))))
            .slice(0, 3);
          setRelatedPosts(related);
        } else {
          navigate('/blog');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  useEffect(() => {
    if (post) {
      useSEO({
        title: post.title,
        description: post.excerpt,
        image: post.imageUrl,
        type: 'article',
        publishedTime: new Date(post.date).toISOString(),
        tags: post.tags || [post.category]
      });
      
      // Track content view
      analytics.trackContentView('blog_post', post.id, post.title);
    }
  }, [post]);

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const generateMockContent = (post: BlogPostType): string => {
    return `
# ${post.title}

${post.excerpt}

## Introduction

Dans le paysage digital actuel, les entreprises cherchent constamment des moyens d'optimiser leurs processus et d'améliorer leur efficacité. Cet article explore en profondeur les concepts présentés dans le résumé.

## Développement

### Point Clé 1

Les tendances actuelles montrent une évolution rapide des technologies et des attentes des utilisateurs. Il est essentiel de rester à jour avec les dernières innovations.

### Point Clé 2

L'implémentation de solutions modernes peut transformer significativement la façon dont une entreprise opère. Les retours sur investissement sont souvent impressionnants.

### Point Clé 3

La stratégie et la planification sont cruciales pour réussir. Sans une approche structurée, même les meilleures technologies peuvent échouer.

## Conclusion

En conclusion, ${post.title.toLowerCase()} représente une opportunité significative pour les entreprises qui souhaitent rester compétitives. L'adoption précoce de ces pratiques peut offrir un avantage concurrentiel majeur.

---

*Cet article fait partie de notre série de réflexions sur ${post.category.toLowerCase()} et les tendances digitales.*
    `.trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <ReadingProgress />
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au blog</span>
        </Link>

        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-blue-400">
            {post.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime || 5} min de lecture</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/5 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6">
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-bold
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:text-gray-300
            prose-blockquote:border-blue-500 prose-blockquote:text-gray-400
            prose-code:text-cyan-400 prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-[#0a0a16] prose-pre:border prose-pre:border-white/10"
          dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br />') || '' }}
        />
      </article>

      {/* Share Section */}
      {post && (
        <div className="max-w-4xl mx-auto px-6 mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold mb-2">Partager cet article</h3>
              <p className="text-gray-400 text-sm">Aidez-nous à faire connaître cet article</p>
            </div>
            <SocialShare
              title={post.title}
              description={post.excerpt}
              contentType="blog"
              contentId={post.id}
            />
          </div>
        </div>
      )}

      {/* Lead Magnet */}
      <div className="max-w-4xl mx-auto px-6 mt-16">
        <LeadMagnet
          title="Guide Gratuit"
          description="Vous avez aimé cet article ? Téléchargez notre guide complet sur le même sujet."
          offer={`Guide Complet : ${post.title}`}
        />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-20">
          <h2 className="text-3xl font-bold text-white mb-8">Articles Similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/blog/${relatedPost.slug}`}
                className="group block"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                  <img
                    src={relatedPost.imageUrl}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="text-gray-500 text-xs mb-2">{relatedPost.date}</div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {relatedPost.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

