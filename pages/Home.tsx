import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Division, DIVISION_CONFIG, BlogPost } from '../types';
import { ArrowRight, Code, Film, Zap, Activity, Users, Zap as ZapIcon, Terminal, Cpu, Layers, Rocket, Globe, Eye, TrendingUp } from 'lucide-react';

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
            className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-700 mix-blend-overlay"
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <motion.div 
            initial={false}
            animate={{ y: isActive ? 0 : 20 }}
            className="relative z-10"
        >
          <div className={`p-3 rounded-lg w-fit mb-4 bg-white/5 backdrop-blur-md border border-white/10`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{config.slogan}</h2>
          <p className={`text-lg md:text-xl font-medium mb-4 ${config.color}`}>{config.label}</p>
          
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
            className="overflow-hidden"
          >
            <p className="text-gray-300 text-sm mb-6 max-w-sm leading-relaxed">
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

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-gray-300 tracking-wider">AGENCE DIGITALE NOUVELLE GÉNÉRATION</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 leading-tight tracking-tight">
            Tech du Futur. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Créativité Cinématique.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light">
            Nous ne faisons pas que coder, nous créons. Nous ne faisons pas que filmer, nous racontons des histoires.
            <span className="block mt-2 text-white font-medium">L'intersection du Code & de l'Art.</span>
          </p>
        </motion.div>
      </section>

      {/* Division Selector (The Core Navigator) */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 h-auto">
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
      <section className="py-20 border-y border-white/5 bg-[#030308]">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold text-white font-mono">50+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
                         <Globe className="w-3 h-3" /> Projets Livrés
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold text-cyan-400 font-mono">15k</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
                         <Terminal className="w-3 h-3" /> Lignes de Code / jour
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold text-fuchsia-400 font-mono">10M+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
                         <Eye className="w-3 h-3" /> Vues Générées
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold text-white font-mono">300%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
                         <TrendingUp className="w-3 h-3" /> ROI Moyen
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* NEW SECTION 2: Methodology (Workflow) */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Le Protocole Aureus</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Comment nous transformons le chaos en clarté. Une méthodologie éprouvée pour les projets complexes.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
                { step: '01', title: 'Immersion', desc: 'Audit profond de votre marque et de vos systèmes actuels.', icon: Users },
                { step: '02', title: 'Architecture', desc: 'Conception technique et storyboard créatif. Rien n\'est laissé au hasard.', icon: Layers },
                { step: '03', title: 'Fusion', desc: 'Développement agile et production vidéo simultanée.', icon: Cpu },
                { step: '04', title: 'Déploiement', desc: 'Lancement, monitoring et itération continue.', icon: Rocket }
            ].map((item, idx) => (
                <div key={idx} className="relative group">
                    <div className="absolute top-0 left-0 text-6xl font-bold text-white/5 -z-10 group-hover:text-white/10 transition-colors">
                        {item.step}
                    </div>
                    <div className="pt-8 pl-4">
                        <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <item.icon className="w-6 h-6 text-gray-400 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    {/* Connector Line (Desktop) */}
                    {idx !== 3 && (
                        <div className="hidden md:block absolute top-14 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-1/2" />
                    )}
                </div>
            ))}
        </div>
      </section>

      {/* NEW SECTION 3: The Arsenal (Tech Stack) */}
      <section className="py-16 bg-[#020205] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8">
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">L'Arsenal Technologique & Créatif</h3>
        </div>
        
        {/* Infinite Scroll Simulation (Simplified with Flex for now) */}
        <div className="flex flex-col space-y-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {/* Tech Row */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {TECH_STACK.map(tech => (
                    <span key={tech} className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-400 hover:from-cyan-400 hover:to-blue-500 cursor-default transition-all">
                        {tech}
                    </span>
                ))}
            </div>
            {/* Creative Row */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {CREATIVE_STACK.map(tool => (
                    <span key={tool} className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-400 hover:from-fuchsia-400 hover:to-pink-500 cursor-default transition-all">
                        {tool}
                    </span>
                ))}
            </div>
        </div>
      </section>

      {/* NEW SECTION 4: Blog Preview */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Dernières Pensées</h2>
                <p className="text-gray-400">Analyses et prospectives.</p>
            </div>
            <Link to="/blog" className="text-sm font-bold text-white hover:text-blue-400 transition-colors flex items-center space-x-1">
                <span>Voir tout le Hub</span>
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LATEST_ARTICLES.map((post) => (
                <Link to="/blog" key={post.id} className="group block">
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                        <img 
                            src={post.imageUrl} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                            {post.category}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-500 text-xs mb-2">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>5 min de lecture</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {post.title}
                    </h3>
                </Link>
            ))}
        </div>
      </section>

      {/* Trust & Why Us (Existing) */}
      <section className="border-t border-white/5 py-24 bg-[#020205]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Pourquoi Aureus ?</h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Esprit Startup Agile</h4>
                    <p className="text-gray-400 text-sm">Pas de bureaucratie. Nous livrons vite, itérons rapidement et nous adaptons à votre rythme.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Expertise Transversale</h4>
                    <p className="text-gray-400 text-sm">Un développeur qui comprend le design. Un vidéaste qui comprend le SEO. C'est notre standard.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
                    <ZapIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg">Orienté Résultats</h4>
                    <p className="text-gray-400 text-sm">Nous ne vendons pas des heures, nous vendons de l'impact, de l'automatisation et de la croissance.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl" />
                <div className="relative bg-[#0a0a16] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center space-x-4 mb-6 opacity-50">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
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
    </div>
  );
};