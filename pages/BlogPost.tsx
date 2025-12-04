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
      <div className="flex justify-center items-center px-6 pt-32 pb-20 min-h-screen">
        <div className="text-center">
          <div className="mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin" />
          <p className="text-gray-400">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <ReadingProgress />
      {/* Header */}
      <div className="mx-auto mb-12 px-6 max-w-4xl">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au blog</span>
        </Link>

        <div className="mb-6">
          <span className="inline-block bg-white/5 px-3 py-1 border border-white/10 rounded-full font-bold text-blue-400 text-xs">
            {post.category}
          </span>
        </div>

        <h1 className="mb-6 font-bold text-white text-4xl md:text-6xl leading-tight">
          {post.title}
        </h1>

        <p className="mb-8 text-gray-300 text-xl leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
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
                  <span key={tag} className="bg-white/5 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Image */}
      <div className="mx-auto mb-12 px-6 max-w-4xl">
        <div className="relative border border-white/10 rounded-2xl aspect-video overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content */}
      <article className="mx-auto px-6 max-w-3xl">
        <div
          className="prose-code:bg-white/5 prose-pre:bg-[#0a0a16] prose-invert prose-code:px-1 prose-code:py-0.5 prose-pre:border prose-blockquote:border-blue-500 prose-pre:border-white/10 prose-code:rounded max-w-none prose-headings:font-bold prose-strong:font-bold prose-a:text-blue-400 prose-blockquote:text-gray-400 prose-code:text-cyan-400 prose-headings:text-white prose-li:text-gray-300 prose-ol:text-gray-300 prose-p:text-gray-300 prose-strong:text-white prose-ul:text-gray-300 hover:prose-a:underline prose-a:no-underline prose-p:leading-relaxed prose prose-lg"
          dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br />') || '' }}
        />
      </article>

      {/* Share Section */}
      {post && (
        <div className="mx-auto mt-12 px-6 pt-8 border-white/10 border-t max-w-4xl">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="mb-2 font-bold text-white">Partager cet article</h3>
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
      <div className="mx-auto mt-16 px-6 max-w-4xl">
        <LeadMagnet
          title="Guide Gratuit"
          description="Vous avez aimé cet article ? Téléchargez notre guide complet sur le même sujet."
          offer={`Guide Complet : ${post.title}`}
        />
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mx-auto mt-20 px-6 max-w-7xl">
          <h2 className="mb-8 font-bold text-white text-3xl">Articles Similaires</h2>
          <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/blog/${relatedPost.slug}`}
                className="group block"
              >
                <div className="relative mb-4 border border-white/10 rounded-xl aspect-video overflow-hidden">
                  <img
                    src={relatedPost.imageUrl}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="mb-2 text-gray-500 text-xs">{relatedPost.date}</div>
                <h3 className="font-bold text-white group-hover:text-blue-400 text-xl transition-colors">
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

