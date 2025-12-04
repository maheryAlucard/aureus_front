import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Division, DIVISION_CONFIG, BlogPost } from '../types';
import { ArrowRight, Code, Film, Zap, Activity, Users, Zap as ZapIcon, Terminal, Cpu, Layers, Rocket, Globe, Eye, TrendingUp, Loader2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { ExitIntentPopup } from '../components/ExitIntentPopup';
import { Testimonials } from '../components/Testimonials';
import { Hero3DBackground } from '../components/Hero3DBackground';
import { apiService } from '../services/apiService';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useTeamMembers } from '../hooks/useTeamMembers';

// Icon mapping helper
const getIcon = (iconName?: string) => {
  const icons: Record<string, any> = {
    Globe, Terminal, Eye, TrendingUp, Users, Layers, Cpu, Rocket, Activity, Zap
  };
  return icons[iconName || ''] || Globe;
};

// --- COMPONENTS ---

interface DivisionCardProps {
  division: Division;
  isActive: boolean;
  isHovered: boolean;
  onHover: (d: Division | null) => void;
}

const DivisionCard: React.FC<DivisionCardProps> = ({ 
  division, 
  isActive, 
  isHovered, 
  onHover 
}) => {
  const config = DIVISION_CONFIG[division];
  const Icon = division === Division.TECH ? Code : division === Division.STUDIO ? Film : Zap;

  return (
    <motion.div
      className={`relative h-[450px] md:h-[600px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border border-white/5 group`}
      onMouseEnter={() => onHover(division)}
      onMouseLeave={() => onHover(null)}
      animate={{
        flex: isActive ? 2 : 1,
        opacity: isHovered && !isActive ? 0.3 : 1,
        filter: isHovered && !isActive ? 'grayscale(100%)' : 'grayscale(0%)'
      }}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Image / Video Placeholder */}
      <div className="absolute inset-0 bg-[#0a0a16]">
        <img 
            src={`https://picsum.photos/seed/${division}v3/800/1000`} 
            alt={config.label}
            className="opacity-30 group-hover:opacity-50 w-full h-full object-cover transition-opacity duration-700 mix-blend-overlay"
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <motion.div 
            initial={false}
            animate={{ y: isActive ? 0 : 20 }}
            className="z-10 relative"
        >
          <div className={`p-3 rounded-lg w-fit mb-4 bg-white/5 backdrop-blur-md border border-white/10`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <h2 className="mb-2 font-bold text-white text-3xl md:text-4xl">{config.slogan}</h2>
          <p className={`text-lg md:text-xl font-medium mb-4 ${config.color}`}>{config.label}</p>
          
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
            className="overflow-hidden"
          >
            <p className="mb-6 max-w-sm text-gray-300 text-sm leading-relaxed">
              {division === Division.TECH && "Nous construisons votre infrastructure numérique (Web, App, IA)."}
              {division === Division.STUDIO && "Nous créons le contenu qui vit dessus (Vidéo, 3D, VFX)."}
              {division === Division.BRAND && "Nous développons votre stratégie de croissance et d'identité."}
            </p>
            <Link 
              to={`/solutions?division=${division}`}
              className={`inline-flex items-center space-x-2 text-sm font-bold ${config.color} hover:text-white transition-colors uppercase tracking-wider`}
            >
              <span>Explorer {config.label}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const Home: React.FC = () => {
  const [activeDivision, setActiveDivision] = useState<Division | null>(null);
  const [homeContent, setHomeContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { blogPosts, fetchBlogPosts } = useBlogPosts();
  const { fetchFeaturedTeamMembers, teamMembers } = useTeamMembers();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [content, featured] = await Promise.all([
          apiService.homePageContent.get(),
          fetchFeaturedTeamMembers()
        ]);
        setHomeContent(content);
        await fetchBlogPosts();
      } catch (error) {
        console.error('Error loading home content:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchBlogPosts, fetchFeaturedTeamMembers]);

  // Fallback to default content if not loaded
  const content = homeContent || {
    heroBadge: 'AGENCE DIGITALE NOUVELLE GÉNÉRATION',
    heroTitle: 'Tech du Futur.',
    heroSubtitle: 'Créativité Cinématique.',
    heroDescription: "Nous ne faisons pas que coder, nous créons. Nous ne faisons pas que filmer, nous racontons des histoires.",
    heroDescriptionHighlight: "L'intersection du Code & de l'Art.",
    metrics: [
      { value: '50+', label: 'Projets Livrés', icon: 'Globe', color: 'text-white' },
      { value: '15k', label: 'Lignes de Code / jour', icon: 'Terminal', color: 'text-cyan-400' },
      { value: '10M+', label: 'Vues Générées', icon: 'Eye', color: 'text-fuchsia-400' },
      { value: '300%', label: 'ROI Moyen', icon: 'TrendingUp', color: 'text-white' },
    ],
    methodologyTitle: 'Le Protocole Aureus',
    methodologyDescription: 'Comment nous transformons le chaos en clarté. Une méthodologie éprouvée pour les projets complexes.',
    methodologySteps: [
      { step: '01', title: 'Immersion', description: "Audit profond de votre marque et de vos systèmes actuels.", icon: 'Users' },
      { step: '02', title: 'Architecture', description: "Conception technique et storyboard créatif. Rien n'est laissé au hasard.", icon: 'Layers' },
      { step: '03', title: 'Fusion', description: 'Développement agile et production vidéo simultanée.', icon: 'Cpu' },
      { step: '04', title: 'Déploiement', description: 'Lancement, monitoring et itération continue.', icon: 'Rocket' },
    ],
    techStackItems: ["React", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "TensorFlow"],
    creativeStackItems: ["Unreal Engine 5", "Cinema 4D", "DaVinci Resolve", "After Effects", "Figma", "Blender", "Redshift"],
    whyUsTitle: 'Pourquoi Aureus ?',
    whyUsItems: [
      { title: 'Esprit Startup Agile', description: "Pas de bureaucratie. Nous livrons vite, itérons rapidement et nous adaptons à votre rythme.", icon: 'Activity', color: 'blue' },
      { title: 'Expertise Transversale', description: "Un développeur qui comprend le design. Un vidéaste qui comprend le SEO. C'est notre standard.", icon: 'Users', color: 'purple' },
      { title: 'Orienté Résultats', description: "Nous ne vendons pas des heures, nous vendons de l'impact, de l'automatisation et de la croissance.", icon: 'Zap', color: 'cyan' },
    ],
    teamTeaserTitle: "L'Équipe derrière la Magie",
    teamTeaserDescription: "Des experts passionnés qui transforment vos idées en réalité.",
    blogSectionTitle: 'Dernières Pensées',
    blogSectionDescription: 'Analyses et prospectives.',
  };

  const latestArticles = blogPosts.slice(0, 3);
  const featuredTeam = teamMembers.filter(m => m.featured).slice(0, 3);
  
  useSEO({
    title: "Aureus | La Rencontre de la Créativité & de l'Intelligence",
    description: "Agence digitale premium spécialisée en développement web/app, production vidéo et branding. Tech, Studio & Brand - Une approche unique pour transformer votre présence digitale.",
    type: 'website'
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-[#020205] min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative mx-auto px-6 py-24 max-w-7xl overflow-hidden text-center">
        {/* 3D Animated Background */}
        <Hero3DBackground />
        
        {/* Abstract Background Elements - Gradient Overlays */}
        <div className="top-0 left-1/2 -z-10 absolute bg-blue-600/10 blur-[120px] rounded-full w-[600px] h-[600px] -translate-x-1/2" />
        <div className="top-1/4 right-0 -z-10 absolute bg-purple-600/10 blur-[100px] rounded-full w-[300px] h-[300px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 relative"
        >
          {content.heroBadge && (
            <div className="inline-flex items-center space-x-2 bg-white/5 mb-8 px-4 py-1 border border-white/10 rounded-full">
              <span className="bg-green-400 rounded-full w-2 h-2 animate-pulse" />
              <span className="font-bold text-gray-300 text-xs tracking-wider">{content.heroBadge}</span>
            </div>
          )}

          <h1 className="mb-6 font-bold text-white text-5xl md:text-8xl leading-tight tracking-tight">
            {content.heroTitle} <br />
            <span className="bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent">
              {content.heroSubtitle}
            </span>
          </h1>
          
          <p className="mx-auto mb-12 max-w-3xl font-light text-gray-400 text-xl md:text-2xl">
            {content.heroDescription}
            {content.heroDescriptionHighlight && (
              <span className="block mt-2 font-medium text-white">{content.heroDescriptionHighlight}</span>
            )}
          </p>
        </motion.div>
      </section>

      {/* Division Selector (The Core Navigator) */}
      <section className="mx-auto px-6 pb-24 max-w-7xl">
        <div className="flex md:flex-row flex-col gap-4 h-auto">
          {Object.values(Division).map((division) => (
            <DivisionCard 
              key={division} 
              division={division} 
              isActive={activeDivision === division}
              isHovered={activeDivision !== null}
              onHover={setActiveDivision}
            />
          ))}
        </div>
      </section>

      {/* NEW SECTION 1: Metrics HUD */}
      {content.metrics && content.metrics.length > 0 && (
        <section className="bg-[#030308] py-20 border-white/5 border-y">
          <div className="mx-auto px-6 max-w-7xl">
              <div className="gap-8 grid grid-cols-2 md:grid-cols-4 text-center">
                  {content.metrics.map((metric: any) => {
                    const Icon = getIcon(metric.icon);
                    return (
                      <div key={metric.id || metric.value} className="space-y-2">
                          <div className={`font-mono font-bold ${metric.color || 'text-white'} text-4xl md:text-5xl`}>
                            {metric.value}
                          </div>
                          <div className="flex justify-center items-center gap-2 text-gray-500 text-xs uppercase tracking-widest">
                               <Icon className="w-3 h-3" /> {metric.label}
                          </div>
                      </div>
                    );
                  })}
              </div>
          </div>
        </section>
      )}

      {/* NEW SECTION 2: Methodology (Workflow) */}
      {content.methodologySteps && content.methodologySteps.length > 0 && (
        <section className="mx-auto px-6 py-24 max-w-7xl">
          <div className="mb-16 text-center">
              {content.methodologyTitle && (
                <h2 className="mb-4 font-bold text-white text-3xl md:text-4xl">{content.methodologyTitle}</h2>
              )}
              {content.methodologyDescription && (
                <p className="mx-auto max-w-2xl text-gray-400">{content.methodologyDescription}</p>
              )}
          </div>
          
          <div className="gap-8 grid grid-cols-1 md:grid-cols-4">
              {content.methodologySteps.map((item: any, idx: number) => {
                const Icon = getIcon(item.icon);
                return (
                <div key={idx} className="group relative">
                    <div className="top-0 left-0 -z-10 absolute font-bold text-white/5 group-hover:text-white/10 text-6xl transition-colors pointer-events-none">
                        {item.step}
                    </div>
                    <div className="z-10 relative pt-8 pl-4">
                        <div className="flex justify-center items-center bg-white/5 group-hover:bg-blue-600 mb-4 border border-white/10 rounded-lg w-12 h-12 group-hover:text-white transition-all duration-300">
                            <Icon className="w-6 h-6 text-gray-400 group-hover:text-white" />
                        </div>
                        <h3 className="mb-2 font-bold text-white text-xl">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.description || item.desc}</p>
                    </div>
                    {/* Connector Line (Desktop) */}
                    {idx !== 3 && (
                        <div className="hidden md:block top-14 right-0 -z-0 absolute bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/2 h-[1px]" />
                    )}
                </div>
                );
              })}
          </div>
        </section>
      )}

      {/* NEW SECTION 3: The Arsenal (Tech Stack) */}
      {(content.techStackItems?.length > 0 || content.creativeStackItems?.length > 0) && (
        <section className="bg-[#020205] py-16 overflow-hidden">
          {content.techStackTitle && (
            <div className="mx-auto mb-8 px-6 max-w-7xl">
                 <h3 className="font-bold text-gray-500 text-sm uppercase tracking-widest">{content.techStackTitle}</h3>
            </div>
          )}
          
          {/* Infinite Horizontal Scroll */}
          <div className="flex flex-col space-y-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
              {/* Tech Row - Auto Scroll */}
              {content.techStackItems && content.techStackItems.length > 0 && (
                <div className="relative overflow-hidden">
                    <div className="flex gap-8 md:gap-16 animate-scroll-left">
                        {/* First set */}
                        {content.techStackItems.map((tech: string, idx: number) => (
                            <span key={`tech-1-${idx}`} className="flex-shrink-0 bg-clip-text bg-gradient-to-r from-gray-600 hover:from-cyan-400 to-gray-400 hover:to-blue-500 font-bold text-transparent text-xl md:text-2xl whitespace-nowrap transition-all cursor-default">
                                {tech}
                            </span>
                        ))}
                        {/* Duplicate for seamless loop */}
                        {content.techStackItems.map((tech: string, idx: number) => (
                            <span key={`tech-2-${idx}`} className="flex-shrink-0 bg-clip-text bg-gradient-to-r from-gray-600 hover:from-cyan-400 to-gray-400 hover:to-blue-500 font-bold text-transparent text-xl md:text-2xl whitespace-nowrap transition-all cursor-default">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
              )}
              {/* Creative Row - Auto Scroll (Reverse) */}
              {content.creativeStackItems && content.creativeStackItems.length > 0 && (
                <div className="relative overflow-hidden">
                    <div className="flex gap-8 md:gap-16 animate-scroll-right">
                        {/* First set */}
                        {content.creativeStackItems.map((tool: string, idx: number) => (
                            <span key={`creative-1-${idx}`} className="flex-shrink-0 bg-clip-text bg-gradient-to-r from-gray-600 hover:from-fuchsia-400 to-gray-400 hover:to-pink-500 font-bold text-transparent text-xl md:text-2xl whitespace-nowrap transition-all cursor-default">
                                {tool}
                            </span>
                        ))}
                        {/* Duplicate for seamless loop */}
                        {content.creativeStackItems.map((tool: string, idx: number) => (
                            <span key={`creative-2-${idx}`} className="flex-shrink-0 bg-clip-text bg-gradient-to-r from-gray-600 hover:from-fuchsia-400 to-gray-400 hover:to-pink-500 font-bold text-transparent text-xl md:text-2xl whitespace-nowrap transition-all cursor-default">
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>
              )}
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="mx-auto px-6 py-24 max-w-7xl">
        <Testimonials />
      </section>

      {/* Team Teaser Section */}
      {featuredTeam.length > 0 && (
        <section className="bg-[#020205] py-24 border-white/5 border-y">
          <div className="mx-auto px-6 max-w-7xl">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="mb-2 font-bold text-white text-3xl md:text-4xl">
                  {content.teamTeaserTitle || "L'Équipe derrière la Magie"}
                </h2>
                <p className="text-gray-400">
                  {content.teamTeaserDescription || "Des experts passionnés qui transforment vos idées en réalité."}
                </p>
              </div>
            <Link 
              to="/team" 
              className="hidden md:flex items-center space-x-1 font-bold text-white hover:text-blue-400 text-sm transition-colors"
            >
              <span>Voir toute l'équipe</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="gap-8 grid grid-cols-1 md:grid-cols-3 mb-8">
            {featuredTeam.map((member, idx) => {
              const config = DIVISION_CONFIG[member.division];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-[#0a0a16] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 aspect-[4/5] overflow-hidden">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  </div>
                  <div className="p-6">
                    <div className="mb-2">
                      <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
                    </div>
                    <h3 className="mb-1 font-bold text-white text-xl">{member.name}</h3>
                    <p className="mb-3 text-gray-400 text-sm">{member.role}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="md:hidden text-center">
            <Link 
              to="/team" 
              className="inline-flex items-center space-x-2 font-bold text-white hover:text-blue-400 text-sm transition-colors"
            >
              <span>Voir toute l'équipe</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* NEW SECTION 4: Blog Preview */}
      {latestArticles.length > 0 && (
        <section className="mx-auto px-6 py-24 max-w-7xl">
          <div className="flex justify-between items-end mb-12">
              <div>
                  <h2 className="mb-2 font-bold text-white text-3xl">
                    {content.blogSectionTitle || 'Dernières Pensées'}
                  </h2>
                  <p className="text-gray-400">
                    {content.blogSectionDescription || 'Analyses et prospectives.'}
                  </p>
              </div>
            <Link to="/blog" className="flex items-center space-x-1 font-bold text-white hover:text-blue-400 text-sm transition-colors">
                <span>Voir tout le Hub</span>
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
        
          <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
              {latestArticles.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="group block">
                    <div className="relative mb-4 border border-white/10 rounded-xl aspect-video overflow-hidden">
                        <img 
                            src={post.imageUrl} 
                            alt={post.title} 
                            className="opacity-80 group-hover:opacity-100 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="top-4 left-4 absolute bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10 rounded-full font-bold text-[10px] text-white uppercase tracking-wider">
                            {post.category}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2 text-gray-500 text-xs">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>5 min de lecture</span>
                    </div>
                    <h3 className="mb-2 font-bold text-white group-hover:text-blue-400 text-lg transition-colors">
                        {post.title}
                    </h3>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="mx-auto px-6 py-24 max-w-7xl">
        <NewsletterSignup source="home" />
      </section>

      {/* Trust & Why Us (Existing) */}
      {content.whyUsItems && content.whyUsItems.length > 0 && (
        <section className="bg-[#020205] py-24 border-white/5 border-t">
          <div className="mx-auto px-6 max-w-7xl">
            <div className="items-center gap-16 grid grid-cols-1 md:grid-cols-2">
              <div>
                {content.whyUsTitle && (
                  <h3 className="mb-6 font-bold text-white text-3xl">{content.whyUsTitle}</h3>
                )}
                <div className="space-y-8">
                  {content.whyUsItems.map((item: any) => {
                    const Icon = getIcon(item.icon);
                    const colorClasses: Record<string, string> = {
                      blue: 'bg-blue-500/10 text-blue-400',
                      purple: 'bg-purple-500/10 text-purple-400',
                      cyan: 'bg-cyan-500/10 text-cyan-400',
                    };
                    return (
                      <div key={item.id || item.title} className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${colorClasses[item.color || 'blue']}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg">{item.title}</h4>
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-2xl rounded-2xl" />
                <div className="relative bg-[#0a0a16] shadow-2xl p-8 border border-white/10 rounded-2xl">
                    <div className="flex items-center space-x-4 opacity-50 mb-6">
                        <div className="bg-red-500 rounded-full w-3 h-3" />
                        <div className="bg-yellow-500 rounded-full w-3 h-3" />
                        <div className="bg-green-500 rounded-full w-3 h-3" />
                    </div>
                    <div className="space-y-3 font-mono text-sm">
                        <div className="text-purple-400">const <span className="text-blue-400">future</span> = <span className="text-yellow-400">await</span> Aureus.build();</div>
                        <div className="text-gray-500">// Optimisation de vos workflows</div>
                        <div className="text-purple-400">if <span className="text-gray-300">(</span>client.ready<span className="text-gray-300">)</span> <span className="text-gray-300">{`{`}</span></div>
                        <div className="pl-4 text-blue-400">scaleBusiness<span className="text-gray-300">();</span></div>
                        <div className="pl-4 text-blue-400">deployCreativity<span className="text-gray-300">();</span></div>
                        <div className="text-gray-300">{`}`}</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>
      )}
      
      <ExitIntentPopup />
    </div>
  );
};