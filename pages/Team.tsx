import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Division, DIVISION_CONFIG, TeamMember } from '../types';
import { Linkedin, Mail, Code, Film, Zap, Filter, Loader2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useTeamMembers } from '../hooks/useTeamMembers';

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
  const { teamMembers, fetchTeamMembers, teamMembersLoading } = useTeamMembers();

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  const filteredMembers = selectedDivision === 'ALL'
    ? teamMembers
    : teamMembers.filter(member => member.division === selectedDivision);

  useSEO({
    title: 'Équipe - Agence Digitale Aureus',
    description: 'Découvrez les talents derrière Aureus. Une équipe multidisciplinaire d\'experts en Tech, Studio et Brand.',
    type: 'website'
  });

  if (teamMembersLoading) {
    return (
      <div className="flex justify-center items-center bg-[#020205] min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="mx-auto mb-16 px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="mb-6 font-bold text-white text-4xl md:text-6xl">
            L'Équipe Aureus
          </h1>
          <p className="mx-auto max-w-2xl text-gray-400 text-xl leading-relaxed">
            Des experts passionnés qui transforment vos idées en réalité.
            Une fusion unique de créativité, technologie et stratégie.
          </p>
        </motion.div>
      </section>

      {/* Filter Section */}
      <section className="mx-auto mb-12 px-6 max-w-7xl">
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <button
            onClick={() => setSelectedDivision('ALL')}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${selectedDivision === 'ALL'
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
                className={`px-6 py-2 rounded-full font-medium text-sm transition-all flex items-center space-x-2 ${selectedDivision === div
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
      <section className="mx-auto px-6 max-w-7xl">
        {filteredMembers.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-lg">Aucun membre trouvé pour cette division.</p>
          </div>
        ) : (
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((member, index) => {
              const config = DIVISION_CONFIG[member.division];
              const Icon = getDivisionIcon(member.division);

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-[#0a0a16] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  {/* Featured Badge */}
                  {member.featured && (
                    <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color} border ${config.border}`}>
                      Featured
                    </div>
                  )}

                  {/* Photo */}
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 aspect-[4/5] overflow-hidden">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${config.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="mb-1 font-bold text-white text-xl">{member.name}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon className={`w-4 h-4 ${config.color}`} />
                          <span className={`text-sm font-medium ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="mb-4 text-gray-400 text-sm">{member.role}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="mb-4 text-gray-300 text-sm line-clamp-3 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.expertise.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="bg-white/5 px-2 py-1 rounded text-gray-400 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.expertise.length > 3 && (
                        <span className="bg-white/5 px-2 py-1 rounded text-gray-500 text-xs">
                          +{member.expertise.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center space-x-3 pt-4 border-white/5 border-t">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                          aria-label={`LinkedIn de ${member.name}`}
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="bg-white/5 hover:bg-white/10 p-2 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
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
      <section className="mx-auto mt-24 px-6 max-w-7xl">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-12 border border-white/10 rounded-2xl text-center">
          <h2 className="mb-4 font-bold text-white text-3xl">
            Rejoignez Notre Équipe
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-400">
            Vous êtes passionné par la technologie, la créativité ou le marketing ?
            Nous recherchons toujours des talents pour renforcer nos divisions.
          </p>
          <a
            href="mailto:careers@aureus.digital"
            className="inline-block bg-blue-600 hover:bg-blue-700 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] px-8 py-3 rounded-full font-bold text-white transition-all"
          >
            Voir les Postes Ouverts
          </a>
        </div>
      </section>
    </div>
  );
};

