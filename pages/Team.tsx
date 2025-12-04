import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Division, DIVISION_CONFIG, TeamMember } from '../types';
import { Linkedin, Mail, Code, Film, Zap, Filter } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

// Mock team data - Replace with real data from API/service
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Alexandre Dubois',
    role: 'Lead Developer & Tech Architect',
    division: Division.TECH,
    bio: 'Expert en architecture cloud et automatisation IA. Transforme les idées complexes en systèmes scalables.',
    photo: 'https://i.pravatar.cc/300?img=12',
    expertise: ['React', 'Python', 'AWS', 'IA/ML'],
    linkedin: 'https://linkedin.com',
    email: 'alexandre@aureus.digital',
    featured: true
  },
  {
    id: '2',
    name: 'Sophie Martin',
    role: 'Creative Director & Video Producer',
    division: Division.STUDIO,
    bio: 'Passionnée par la narration visuelle et le color grading. Crée des expériences cinématographiques mémorables.',
    photo: 'https://i.pravatar.cc/300?img=47',
    expertise: ['DaVinci Resolve', 'After Effects', 'Cinema 4D', 'Direction Artistique'],
    linkedin: 'https://linkedin.com',
    email: 'sophie@aureus.digital',
    featured: true
  },
  {
    id: '3',
    name: 'Thomas Leroy',
    role: 'Brand Strategist & Growth Hacker',
    division: Division.BRAND,
    bio: 'Spécialiste en stratégie de marque et croissance. Construit des communautés engagées et des identités fortes.',
    photo: 'https://i.pravatar.cc/300?img=33',
    expertise: ['Branding', 'Social Media', 'Growth Marketing', 'UX/UI'],
    linkedin: 'https://linkedin.com',
    email: 'thomas@aureus.digital',
    featured: true
  },
  {
    id: '4',
    name: 'Marie Chen',
    role: 'Full-Stack Developer',
    division: Division.TECH,
    bio: 'Développeuse polyvalente spécialisée en applications modernes et interfaces utilisateur intuitives.',
    photo: 'https://i.pravatar.cc/300?img=20',
    expertise: ['Next.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    linkedin: 'https://linkedin.com',
    email: 'marie@aureus.digital'
  },
  {
    id: '5',
    name: 'Lucas Bernard',
    role: 'VFX Artist & Motion Designer',
    division: Division.STUDIO,
    bio: 'Artiste VFX créant des effets visuels époustouflants et des animations fluides pour le web et le cinéma.',
    photo: 'https://i.pravatar.cc/300?img=51',
    expertise: ['VFX', 'Motion Design', 'Unreal Engine', 'Blender'],
    linkedin: 'https://linkedin.com',
    email: 'lucas@aureus.digital'
  },
  {
    id: '6',
    name: 'Emma Rousseau',
    role: 'UI/UX Designer & Brand Designer',
    division: Division.BRAND,
    bio: 'Designer créative transformant les concepts en identités visuelles cohérentes et interfaces utilisateur élégantes.',
    photo: 'https://i.pravatar.cc/300?img=32',
    expertise: ['Figma', 'Branding', 'UI/UX', 'Design System'],
    linkedin: 'https://linkedin.com',
    email: 'emma@aureus.digital'
  },
  {
    id: '7',
    name: 'Nicolas Petit',
    role: 'DevOps Engineer & Automation Specialist',
    division: Division.TECH,
    bio: 'Expert en infrastructure cloud et CI/CD. Automatise les déploiements pour une livraison continue.',
    photo: 'https://i.pravatar.cc/300?img=15',
    expertise: ['Kubernetes', 'Terraform', 'CI/CD', 'Monitoring'],
    linkedin: 'https://linkedin.com',
    email: 'nicolas@aureus.digital'
  },
  {
    id: '8',
    name: 'Camille Moreau',
    role: 'Video Editor & Colorist',
    division: Division.STUDIO,
    bio: 'Monteuse et étalonneuse passionnée. Donne vie aux images avec un sens aigu du rythme et de la couleur.',
    photo: 'https://i.pravatar.cc/300?img=45',
    expertise: ['Montage', 'Color Grading', 'Sound Design', 'Post-Production'],
    linkedin: 'https://linkedin.com',
    email: 'camille@aureus.digital'
  }
];

const getDivisionIcon = (division: Division) => {
  switch (division) {
    case Division.TECH:
      return Code;
    case Division.STUDIO:
      return Film;
    case Division.BRAND:
      return Zap;
    default:
      return Code;
  }
};

export const Team: React.FC = () => {
  const [selectedDivision, setSelectedDivision] = useState<Division | 'ALL'>('ALL');
  const filteredMembers = selectedDivision === 'ALL' 
    ? TEAM_MEMBERS 
    : TEAM_MEMBERS.filter(member => member.division === selectedDivision);

  useSEO({
    title: 'Équipe - Agence Digitale Aureus',
    description: 'Découvrez les talents derrière Aureus. Une équipe multidisciplinaire d\'experts en Tech, Studio et Brand.',
    type: 'website'
  });

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            L'Équipe Aureus
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Des experts passionnés qui transforment vos idées en réalité. 
            Une fusion unique de créativité, technologie et stratégie.
          </p>
        </motion.div>
      </section>

      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <button
            onClick={() => setSelectedDivision('ALL')}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
              selectedDivision === 'ALL'
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            Tous
          </button>
          {Object.values(Division).map((div) => {
            const config = DIVISION_CONFIG[div];
            const Icon = getDivisionIcon(div);
            return (
              <button
                key={div}
                onClick={() => setSelectedDivision(div)}
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all flex items-center space-x-2 ${
                  selectedDivision === div
                    ? `${config.bg} ${config.color} border ${config.border}`
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Team Grid */}
      <section className="max-w-7xl mx-auto px-6">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Aucun membre trouvé pour cette division.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member, index) => {
              const config = DIVISION_CONFIG[member.division];
              const Icon = getDivisionIcon(member.division);
              
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-[#0a0a16] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
                >
                  {/* Featured Badge */}
                  {member.featured && (
                    <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color} border ${config.border}`}>
                      Featured
                    </div>
                  )}

                  {/* Photo */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon className={`w-4 h-4 ${config.color}`} />
                          <span className={`text-sm font-medium ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{member.role}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                      {member.bio}
                    </p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.expertise.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.expertise.length > 3 && (
                        <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-500">
                          +{member.expertise.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-white/5">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                          aria-label={`LinkedIn de ${member.name}`}
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                          aria-label={`Email de ${member.name}`}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-white/10 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Rejoignez Notre Équipe
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Vous êtes passionné par la technologie, la créativité ou le marketing ? 
            Nous recherchons toujours des talents pour renforcer nos divisions.
          </p>
          <a
            href="mailto:careers@aureus.digital"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold text-white transition-all hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]"
          >
            Voir les Postes Ouverts
          </a>
        </div>
      </section>
    </div>
  );
};

