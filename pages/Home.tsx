import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Division, DIVISION_CONFIG, BlogPost } from '../types';
import { ArrowRight, Code, Film, Zap, Activity, Users, Zap as ZapIcon, Terminal, Cpu, Layers, Rocket, Globe, Eye, TrendingUp } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { ExitIntentPopup } from '../components/ExitIntentPopup';
import { Testimonials } from '../components/Testimonials';

// --- MOCK DATA FOR NEW SECTIONS ---
const TECH_STACK = [
  "React", "Next.js", "Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "TensorFlow"
];
const CREATIVE_STACK = [
  "Unreal Engine 5", "Cinema 4D", "DaVinci Resolve", "After Effects", "Figma", "Blender", "Redshift"
];

const LATEST_ARTICLES: BlogPost[] = [
    {
        id: '1',
        title: 'L\'IA et le Support Client',
        excerpt: 'Réduire vos coûts de 40% avec des agents autonomes.',
        category: 'Tech',
        date: '12 Oct',
        imageUrl: 'https://picsum.photos/seed/ai/800/600',
        slug: 'ai-agents'
    },
    {
        id: '2',
        title: 'Psychologie des Couleurs',
        excerpt: 'L\'impact du Color Grading sur la perception de marque.',
        category: 'Studio',
        date: '08 Oct',
        imageUrl: 'https://picsum.photos/seed/color/800/600',
        slug: 'color-grading'
    },
    {
        id: '3',
        title: 'Refonte UX/UI 2024',
        excerpt: 'Les tendances minimalistes qui convertissent.',
        category: 'Brand',
        date: '01 Oct',
        imageUrl: 'https://picsum.photos/seed/next/800/600',
        slug: 'ux-trends'
    }
];

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
  
  useSEO({
    title: "Aureus | La Rencontre de la Créativité & de l'Intelligence",
    description: "Agence digitale premium spécialisée en développement web/app, production vidéo et branding. Tech, Studio & Brand - Une approche unique pour transformer votre présence digitale.",
    type: 'website'
  });

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative mx-auto px-6 py-24 max-w-7xl overflow-hidden text-center">
        {/* Abstract Background Elements */}
        <div className="top-0 left-1/2 -z-10 absolute bg-blue-600/10 blur-[120px] rounded-full w-[600px] h-[600px] -translate-x-1/2" />
        <div className="top-1/4 right-0 -z-10 absolute bg-purple-600/10 blur-[100px] rounded-full w-[300px] h-[300px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 mb-8 px-4 py-1 border border-white/10 rounded-full">
            <span className="bg-green-400 rounded-full w-2 h-2 animate-pulse" />
            <span className="font-bold text-gray-300 text-xs tracking-wider">AGENCE DIGITALE NOUVELLE GÉNÉRATION</span>
          </div>

          <h1 className="mb-6 font-bold text-white text-5xl md:text-8xl leading-tight tracking-tight">
            Tech du Futur. <br />
            <span className="bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent">
              Créativité Cinématique.
            </span>
          </h1>
          
          <p className="mx-auto mb-12 max-w-3xl font-light text-gray-400 text-xl md:text-2xl">
            Nous ne faisons pas que coder, nous créons. Nous ne faisons pas que filmer, nous racontons des histoires.
            <span className="block mt-2 font-medium text-white">L'intersection du Code & de l'Art.</span>
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
      <section className="bg-[#030308] py-20 border-white/5 border-y">
        <div className="mx-auto px-6 max-w-7xl">
            <div className="gap-8 grid grid-cols-2 md:grid-cols-4 text-center">
                <div className="space-y-2">
                    <div className="font-mono font-bold text-white text-4xl md:text-5xl">50+</div>
                    <div className="flex justify-center items-center gap-2 text-gray-500 text-xs uppercase tracking-widest">
                         <Globe className="w-3 h-3" /> Projets Livrés
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="font-mono font-bold text-cyan-400 text-4xl md:text-5xl">15k</div>
                    <div className="flex justify-center items-center gap-2 text-gray-500 text-xs uppercase tracking-widest">
                         <Terminal className="w-3 h-3" /> Lignes de Code / jour
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="font-mono font-bold text-fuchsia-400 text-4xl md:text-5xl">10M+</div>
                    <div className="flex justify-center items-center gap-2 text-gray-500 text-xs uppercase tracking-widest">
                         <Eye className="w-3 h-3" /> Vues Générées
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="font-mono font-bold text-white text-4xl md:text-5xl">300%</div>
                    <div className="flex justify-center items-center gap-2 text-gray-500 text-xs uppercase tracking-widest">
                         <TrendingUp className="w-3 h-3" /> ROI Moyen
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* NEW SECTION 2: Methodology (Workflow) */}
      <section className="mx-auto px-6 py-24 max-w-7xl">
        <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-white text-3xl md:text-4xl">Le Protocole Aureus</h2>
            <p className="mx-auto max-w-2xl text-gray-400">Comment nous transformons le chaos en clarté. Une méthodologie éprouvée pour les projets complexes.</p>
        </div>
        
        <div className="gap-8 grid grid-cols-1 md:grid-cols-4">
            {[
                { step: '01', title: 'Immersion', desc: 'Audit profond de votre marque et de vos systèmes actuels.', icon: Users },
                { step: '02', title: 'Architecture', desc: 'Conception technique et storyboard créatif. Rien n\'est laissé au hasard.', icon: Layers },
                { step: '03', title: 'Fusion', desc: 'Développement agile et production vidéo simultanée.', icon: Cpu },
                { step: '04', title: 'Déploiement', desc: 'Lancement, monitoring et itération continue.', icon: Rocket }
            ].map((item, idx) => (
                <div key={idx} className="group relative">
                    <div className="top-0 left-0 -z-10 absolute font-bold text-white/5 group-hover:text-white/10 text-6xl transition-colors pointer-events-none">
                        {item.step}
                    </div>
                    <div className="z-10 relative pt-8 pl-4">
                        <div className="flex justify-center items-center bg-white/5 group-hover:bg-blue-600 mb-4 border border-white/10 rounded-lg w-12 h-12 group-hover:text-white transition-all duration-300">
                            <item.icon className="w-6 h-6 text-gray-400 group-hover:text-white" />
                        </div>
                        <h3 className="mb-2 font-bold text-white text-xl">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                    {/* Connector Line (Desktop) */}
                    {idx !== 3 && (
                        <div className="hidden md:block top-14 right-0 -z-0 absolute bg-gradient-to-r from-transparent via-white/10 to-transparent w-1/2 h-[1px]" />
                    )}
                </div>
            ))}
        </div>
      </section>

      {/* NEW SECTION 3: The Arsenal (Tech Stack) */}
      <section className="bg-[#020205] py-16 overflow-hidden">
        <div className="mx-auto mb-8 px-6 max-w-7xl">
             <h3 className="font-bold text-gray-500 text-sm uppercase tracking-widest">L'Arsenal Technologique & Créatif</h3>
        </div>
        
        {/* Infinite Horizontal Scroll */}
        <div className="flex flex-col space-y-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {/* Tech Row - Auto Scroll */}
            <div className="relative overflow-hidden">
                <div className="flex gap-8 md:gap-16 animate-scroll-left">
                    {/* First set */}
                    {TECH_STACK.map((tech, idx) => (
                        <span key={`tech-1-${idx}`} className="flex-shrink-0 bg-clip-text bg-gradient-to-r from-gray-600 hover:from-cyan-400 to-gray-400 hover:to-blue-500 font-bold text-transparent text-xl md:text-2xl whitespace-nowrap transition-all cursor-default">
                            {tech}
                        </span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {TECH_STACK.map((tech, idx) => (
                        <span key={`tech-2-${idx}`} className="flex-shrink-0 bg-clip-text bg-gradient-to-r from-gray-600 hover:from-cyan-400 to-gray-400 hover:to-blue-500 font-bold text-transparent text-xl md:text-2xl whitespace-nowrap transition-all cursor-default">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
            {/* Creative Row - Auto Scroll (Reverse) */}
            <div className="relative overflow-hidden">
                <div className="flex gap-8 md:gap-16 animate-scroll-right">
                    {/* First set */}
                    {CREATIVE_STACK.map((tool, idx) => (
                        <span key={`creative-1-${idx}`} className="flex-shrink-0 bg-clip-text bg-gradient-to-r from-gray-600 hover:from-fuchsia-400 to-gray-400 hover:to-pink-500 font-bold text-transparent text-xl md:text-2xl whitespace-nowrap transition-all cursor-default">
                            {tool}
                        </span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {CREATIVE_STACK.map((tool, idx) => (
                        <span key={`creative-2-${idx}`} className="flex-shrink-0 bg-clip-text bg-gradient-to-r from-gray-600 hover:from-fuchsia-400 to-gray-400 hover:to-pink-500 font-bold text-transparent text-xl md:text-2xl whitespace-nowrap transition-all cursor-default">
                            {tool}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto px-6 py-24 max-w-7xl">
        <Testimonials />
      </section>

      {/* NEW SECTION 4: Blog Preview */}
      <section className="mx-auto px-6 py-24 max-w-7xl">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="mb-2 font-bold text-white text-3xl">Dernières Pensées</h2>
                <p className="text-gray-400">Analyses et prospectives.</p>
            </div>
            <Link to="/blog" className="flex items-center space-x-1 font-bold text-white hover:text-blue-400 text-sm transition-colors">
                <span>Voir tout le Hub</span>
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
        
        <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
            {LATEST_ARTICLES.map((post) => (
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

      {/* Newsletter Section */}
      <section className="mx-auto px-6 py-24 max-w-7xl">
        <NewsletterSignup source="home" />
      </section>

      {/* Trust & Why Us (Existing) */}
      <section className="bg-[#020205] py-24 border-white/5 border-t">
        <div className="mx-auto px-6 max-w-7xl">
          <div className="items-center gap-16 grid grid-cols-1 md:grid-cols-2">
            <div>
              <h3 className="mb-6 font-bold text-white text-3xl">Pourquoi Aureus ?</h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Esprit Startup Agile</h4>
                    <p className="text-gray-400 text-sm">Pas de bureaucratie. Nous livrons vite, itérons rapidement et nous adaptons à votre rythme.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500/10 p-3 rounded-lg text-purple-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Expertise Transversale</h4>
                    <p className="text-gray-400 text-sm">Un développeur qui comprend le design. Un vidéaste qui comprend le SEO. C'est notre standard.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-cyan-500/10 p-3 rounded-lg text-cyan-400">
                    <ZapIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Orienté Résultats</h4>
                    <p className="text-gray-400 text-sm">Nous ne vendons pas des heures, nous vendons de l'impact, de l'automatisation et de la croissance.</p>
                  </div>
                </div>
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
      
      <ExitIntentPopup />
    </div>
  );
};