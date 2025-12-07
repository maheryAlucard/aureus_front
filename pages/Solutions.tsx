import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Division, DIVISION_CONFIG, Project } from '../types';
import { CheckCircle2, ArrowRight, Video, Music, Lightbulb, Play, ChevronLeft, ChevronRight, Phone, Mail, Twitter, Github, Linkedin } from 'lucide-react';
import { Testimonials } from '../components/Testimonials';
import { useSEO } from '../hooks/useSEO';
import { useTeamMembers } from '../hooks/useTeamMembers';

// Mock Studio projects for portfolio
const STUDIO_PROJECTS: Project[] = [
  { id: '1', title: 'Automotive Commercial', client: 'Auto Brand', division: Division.STUDIO, tags: ['Commercial'], imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW1JAEqUh-m__iFLvKQspO9AxuYft-LoRrcC0rkKvurkvRhtEaOZbZcO0SgAdHPyeIXQFfLcVvhOjmUfoQctWzqdMBO9IRlTCGtdQCWgbCqYKb87bt5NGU_hhMgOVnCWhScoYe_adBQ4C_mtNShUCTzSdMMNVQ0CsL5g9OFB8j1cBJLMtjPes8MNPJiryIxYKncv6t_0GxRYMCJZ7vORL2Gmu1Lrj71kn5Wwc2r7wr1gkuOIAjcHRqSnZxPOaUnWG7Lxhx0MyELBc', description: 'Automotive Commercial' },
  { id: '2', title: 'Fashion Film', client: 'Fashion Brand', division: Division.STUDIO, tags: ['Fashion'], imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAecCx0yNY_VxJvV6-pQtYAILNtxitOqT4EtZaLyzJK7kbfJRrN6RNhvJNL0rVcN3LVZiG4rtEPdNKdgUufnNmd41nnc8R1urG8UbfMKrud388i0zi-nRZ-Z2kTxxwx8wU1zcFt2ELgZ9o4_4Dgwyr3Zn01Q2xflQ_B6fudM4b1I88WtkzQXmhpPRn-UbaU_MJvScwUr0kAhGUhqjKnhaCIz6VOSO7Ics3p3TVGMWfuJ48mKrUFiItPqgk6_DOuv77p0rNXFAm5aUY', description: 'Fashion Film' },
  { id: '3', title: 'Music Video - Eclipse', client: 'Artist', division: Division.STUDIO, tags: ['Music Video'], imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh_PCUveMQ7Ledpq9Q25gxlFLvDwVObBC0kowHDYIlXSXaBJLbWFormfLrEnbSo0zZyMWCpCoRpoZzF6yZUbriEpg-ZxxbpQgcMwblGG_WshnHEFA8wIYRNrapw0XqoiiebLv6gOm7UgGR-8wB8_e0_xfVYAwxwDOFdy0_hdvPCBXkW0hXiYrcYaSWLqf8eznyaMROYdPvPNhJX1a7fbcOLlI7e2oc6lLcJDgVBuVQ0_YDpVIOK9h7Si3K_mfY_HWVGprDbAfoQRQ', description: 'Music Video - Eclipse', videoUrl: '#' },
  { id: '4', title: 'Documentary - The Artisan', client: 'Doc Producer', division: Division.STUDIO, tags: ['Documentary'], imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZjmv42uih_cmy34pk-knHjAiwbQvwdAKLYyJskv8SqfMwKvozrHNNqJmU7N5VBIPA_j-3lwvmKw2SKejCpr0B_UbA4nJpErI8JGJpJGQtQdcLe3n5RC3jelxUgeyO59kMQL2G-qIV8pNKgJUaJOaWMx1xBftwBkKWPcp_iWicbI_0jJ0MzC11XiWtVlnOKFBhJPYLybM1_1bpSMpTT-ipP6VWEZISUYH3mrrDtBDuUhx6IUkgOLB9DK8nt7r7Nt0uxUWXuurR92A', description: 'Documentary - The Artisan' },
  { id: '5', title: 'Documentary - The Artisan', client: 'Doc Producer', division: Division.STUDIO, tags: ['Documentary'], imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZjmv42uih_cmy34pk-knHjAiwbQvwdAKLYyJskv8SqfMwKvozrHNNqJmU7N5VBIPA_j-3lwvmKw2SKejCpr0B_UbA4nJpErI8JGJpJGQtQdcLe3n5RC3jelxUgeyO59kMQL2G-qIV8pNKgJUaJOaWMx1xBftwBkKWPcp_iWicbI_0jJ0MzC11XiWtVlnOKFBhJPYLybM1_1bpSMpTT-ipP6VWEZISUYH3mrrDtBDuUhx6IUkgOLB9DK8nt7r7Nt0uxUWXuurR92A', description: 'Documentary - The Artisan' },
  { id: '6', title: 'Automotive Commercial', client: 'Auto Brand', division: Division.STUDIO, tags: ['Commercial'], imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDW1JAEqUh-m__iFLvKQspO9AxuYft-LoRrcC0rkKvurkvRhtEaOZbZcO0SgAdHPyeIXQFfLcVvhOjmUfoQctWzqdMBO9IRlTCGtdQCWgbCqYKb87bt5NGU_hhMgOVnCWhScoYe_adBQ4C_mtNShUCTzSdMMNVQ0CsL5g9OFB8j1cBJLMtjPes8MNPJiryIxYKncv6t_0GxRYMCJZ7vORL2Gmu1Lrj71kn5Wwc2r7wr1gkuOIAjcHRqSnZxPOaUnWG7Lxhx0MyELBc', description: 'Automotive Commercial' },
  { id: '7', title: 'Decumfidy - The Artisan', client: 'Doc Producer', division: Division.STUDIO, tags: ['Documentary'], imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAecCx0yNY_VxJvV6-pQtYAILNtxitOqT4EtZaLyzJK7kbfJRrN6RNhvJNL0rVcN3LVZiG4rtEPdNKdgUufnNmd41nnc8R1urG8UbfMKrud388i0zi-nRZ-Z2kTxxwx8wU1zcFt2ELgZ9o4_4Dgwyr3Zn01Q2xflQ_B6fudM4b1I88WtkzQXmhpPRn-UbaU_MJvScwUr0kAhGUhqjKnhaCIz6VOSO7Ics3p3TVGMWfuJ48mKrUFiItPqgk6_DOuv77p0rNXFAm5aUY', description: 'Decumfidy - The Artisan' },
  { id: '8', title: 'Music Video - Eclipse', client: 'Artist', division: Division.STUDIO, tags: ['Music Video'], imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh_PCUveMQ7Ledpq9Q25gxlFLvDwVObBC0kowHDYIlXSXaBJLbWFormfLrEnbSo0zZyMWCpCoRpoZzF6yZUbriEpg-ZxxbpQgcMwblGG_WshnHEFA8wIYRNrapw0XqoiiebLv6gOm7UgGR-8wB8_e0_xfVYAwxwDOFdy0_hdvPCBXkW0hXiYrcYaSWLqf8eznyaMROYdPvPNhJX1a7fbcOLlI7e2oc6lLcJDgVBuVQ0_YDpVIOK9h7Si3K_mfY_HWVGprDbAfoQRQ', description: 'Music Video - Eclipse' },
  { id: '9', title: 'Fashion Film', client: 'Fashion Brand', division: Division.STUDIO, tags: ['Fashion'], imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAecCx0yNY_VxJvV6-pQtYAILNtxitOqT4EtZaLyzJK7kbfJRrN6RNhvJNL0rVcN3LVZiG4rtEPdNKdgUufnNmd41nnc8R1urG8UbfMKrud388i0zi-nRZ-Z2kTxxwx8wU1zcFt2ELgZ9o4_4Dgwyr3Zn01Q2xflQ_B6fudM4b1I88WtkzQXmhpPRn-UbaU_MJvScwUr0kAhGUhqjKnhaCIz6VOSO7Ics3p3TVGMWfuJ48mKrUFiItPqgk6_DOuv77p0rNXFAm5aUY', description: 'Fashion Film' },
  { id: '10', title: 'Music Video', client: 'Artist', division: Division.STUDIO, tags: ['Music Video'], imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZjmv42uih_cmy34pk-knHjAiwbQvwdAKLYyJskv8SqfMwKvozrHNNqJmU7N5VBIPA_j-3lwvmKw2SKejCpr0B_UbA4nJpErI8JGJpJGQtQdcLe3n5RC3jelxUgeyO59kMQL2G-qIV8pNKgJUaJOaWMx1xBftwBkKWPcp_iWicbI_0jJ0MzC11XiWtVlnOKFBhJPYLybM1_1bpSMpTT-ipP6VWEZISUYH3mrrDtBDuUhx6IUkgOLB9DK8nt7r7Nt0uxUWXuurR92A', description: 'Music Video' },
];

export const Solutions: React.FC = () => {
  const query = new URLSearchParams(useLocation().search);
  const activeDivision = (query.get('division') as Division) || Division.TECH;
  const config = DIVISION_CONFIG[activeDivision];
  const { teamMembers, fetchTeamMembers } = useTeamMembers();
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    if (activeDivision === Division.STUDIO) {
      fetchTeamMembers();
    }
  }, [activeDivision, fetchTeamMembers]);

  useSEO({
    title: `${config.label} - Solutions`,
    description: config.desc,
    type: 'website'
  });

  // Visual Vibe config based on strategy
  const isTech = activeDivision === Division.TECH;
  const isStudio = activeDivision === Division.STUDIO;

  const themeClasses = isTech
    ? "font-mono"
    : isStudio
      ? "font-serif italic"
      : "";

  const crossPollination = {
    [Division.TECH]: {
      text: "Besoin de contenu visuel pour votre nouveau site ?",
      linkText: "Découvrir Aureus Studio",
      target: Division.STUDIO
    },
    [Division.STUDIO]: {
      text: "Vous voulez diffuser votre vidéo efficacement ?",
      linkText: "Voir Aureus Brand",
      target: Division.BRAND
    },
    [Division.BRAND]: {
      text: "Prêt à automatiser votre croissance ?",
      linkText: "Explorer Aureus Tech",
      target: Division.TECH
    }
  };

  // Studio team members (first 3)
  const studioTeamMembers = isStudio ? teamMembers.filter(m => m.division === Division.STUDIO).slice(0, 3) : [];

  return (
    <div className={`pt-20 min-h-screen ${isStudio ? 'bg-[#0D0914]' : ''}`}>
      {/* Hero */}
      <div className={`relative py-24 overflow-hidden text-center ${isStudio ? 'hero-bg' : ''}`} style={isStudio ? { background: 'linear-gradient(to bottom, rgba(47, 26, 91, 0.4), rgba(13, 9, 20, 0) 70%)' } : {}}>
        <div className={`absolute inset-0 bg-gradient-to-b ${config.gradient} opacity-5`} />
        {isTech && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />}
        {isStudio && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />}

        <div className="z-10 relative mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className={`inline-block py-1 px-3 rounded-full ${isStudio ? `${config.bg} border ${config.border} ${config.color}` : 'bg-white/5 border border-white/10'} text-xs font-semibold mb-6`}>
              {isStudio ? 'DIVISION: AUREUS STUDIO' : `DIVISION : ${config.label.toUpperCase()}`}
            </span>
            <h1 className={`text-6xl md:text-8xl font-medium text-white tracking-tight mb-6 ${themeClasses}`}>
              {config.slogan}
            </h1>
            <p className="mx-auto max-w-2xl text-[#D1D1D1] text-lg leading-relaxed">
              {activeDivision === Division.TECH && "Transformation digitale de bout en bout. Nous codons vos idées et automatisons vos processus."}
              {activeDivision === Division.STUDIO && "Production cinématographique haut de gamme. Nous capturons l'émotion et sculptons la lumière."}
              {activeDivision === Division.BRAND && "Stratégie de marque impactante. Nous construisons des communautés et des identités mémorables."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sub-Services Details */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl"
      >
        {isStudio ? (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10 font-bold text-white text-3xl md:text-left text-center"
            >
              Nos Services
            </motion.h2>
            <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {config.subServices?.map((service, idx) => {
                const icons = [Video, Music, Lightbulb];
                const Icon = icons[idx] || CheckCircle2;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group bg-[#191522] p-8 rounded-2xl transition-all duration-300"
                  >
                    <motion.div
                      className="flex items-center gap-4 mb-4"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className={`${config.bg} p-2 rounded-full`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className={`h-6 w-6 ${config.color}`} />
                      </motion.div>
                      <h3 className="font-semibold text-white text-xl">{service.title}</h3>
                    </motion.div>
                    <p className="text-[#D1D1D1]">{service.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
            {config.subServices?.map((service, idx) => (
              <div key={idx} className="group bg-[#0a0a16] p-8 border border-white/5 hover:border-white/20 rounded-xl transition-all duration-300">
                <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 ${config.color} group-hover:scale-110 transition-transform`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="mb-3 font-bold text-white text-xl">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Latest Work Section - Studio Only */}
      {isStudio && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex md:flex-row flex-col md:justify-between md:items-center mb-10"
          >
            <div>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`inline-block ${config.bg} border ${config.border} ${config.color} text-xs font-semibold px-3 py-1 rounded-full mb-4`}
              >
                PORTFOLIO/SHOWREEL
              </motion.span>
              <h2 className="font-bold text-white text-3xl" id="latest-work-heading">Nos Dernières Réalisations</h2>
            </div>
          </motion.div>
          <div className="gap-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {STUDIO_PROJECTS.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <motion.div
                  className="relative rounded-lg aspect-[4/3] overflow-hidden"
                  whileHover={{ boxShadow: "0 20px 40px rgba(123, 97, 255, 0.3)" }}
                >
                  <motion.img
                    alt={project.title}
                    className="rounded-lg w-full object-cover aspect-[4/3]"
                    src={project.imageUrl}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <motion.div
                    className="absolute inset-0 flex justify-center items-center bg-black/20 group-hover:bg-black/40 transition-colors"
                  >
                    <motion.div
                      className="flex justify-center items-center bg-white/30 group-hover:bg-white/40 backdrop-blur-sm rounded-full w-14 group-hover:w-16 h-14 group-hover:h-16 transition-all"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg className="ml-1 w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </motion.div>
                  </motion.div>
                </motion.div>
                <motion.p
                  className="mt-2 font-medium text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 + 0.2 }}
                >
                  {project.title}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Meet the Team Section - Studio Only */}
      {isStudio && studioTeamMembers.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`inline-block ${config.bg} border ${config.border} ${config.color} text-xs font-semibold px-3 py-1 rounded-full mb-4`}
          >
            À PROPOS DE NOUS
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 font-bold text-white text-3xl"
            id="team-heading"
          >
            Rencontrez l'Équipe
          </motion.h2>
          <div className="gap-12 grid grid-cols-1 md:grid-cols-3 mx-auto max-w-4xl">
            {studioTeamMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="flex flex-col items-center"
              >
                <motion.img
                  alt={`Portrait of ${member.name}`}
                  className="mb-4 rounded-full w-32 h-32 object-cover"
                  src={member.photo}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <h3 className="font-semibold text-white text-xl">{member.name}</h3>
                <p className="text-[#D1D1D1]">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Why Choose Us Section - Studio Only */}
      {isStudio && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 font-bold text-white text-3xl text-center"
            id="why-choose-us-heading"
          >
            Pourquoi Nous Choisir
          </motion.h2>
          <div className="gap-12 grid grid-cols-1 md:grid-cols-3 mx-auto max-w-5xl text-center">
            {[
              { icon: Play, title: "Qualité Cinématographique", desc: "Qualité de contenu et génération de qualité cinématographique, attention aux détails durables." },
              { icon: Lightbulb, title: "Narration Experte", desc: "Découvrez une autre histoire grâce à notre narration experte, créative et durable." },
              { icon: Video, title: "Technologie de Pointe", desc: "Personnalisé pour répondre aux technologies de pointe et aux exigences personnalisées." }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    className={`mb-4 ${config.bg} p-3 rounded-xl border ${config.border}`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className={`h-8 w-8 ${config.color}`} />
                  </motion.div>
                  <h3 className="mb-2 font-semibold text-white text-xl">{feature.title}</h3>
                  <p className="text-[#D1D1D1]">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Feature Showcase (Landing Page Style) */}
      {isStudio ? (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-[#191522] rounded-3xl p-4 md:p-6 lg:p-8 flex flex-col md:flex-row items-center gap-8`}
          >
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.img
                alt="Golden Gate Bridge at sunset"
                className="rounded-2xl w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKgJw1yYmoNTJx6SA_rlGxmcmgpTo17znx3k9R7_ftQ-OGOxnW-mhr8ZqqkwsHya156p1gOkegVQd0a9kbizF0Qr57U8D_Zeo9CI13E2tWVhvaQ1Uacr4GnUflrTJqWjX8Fyz18YMtxEx_T9DwuJui0ode_FoupyHIPL4Sx2EwSJFknK0xzX1x2o7491XogRHLJw9HhtpoZCPxmKYWVDb0C4-dzdUVm9nJu7rTAnt-WrcoyhcC1Mm_csHjeKK0-sisHFdI5Dsftfc"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div
              className="w-full md:w-1/2 md:text-left text-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="mb-4 font-bold text-white text-3xl lg:text-4xl" id="lookbook-heading">Télécharger le Lookbook</h2>
              <p className="mb-8 text-[#D1D1D1]">Explorez nos styles de colorimétrie et nos techniques de cadrage pour votre prochain projet.</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className={`bg-gradient-to-r ${config.gradient} text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:brightness-110 transition-all inline-block`}
                >
                  Télécharger
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>
      ) : (
        <div className="bg-white/5 py-20 border-white/5 border-y">
          <div className="items-center gap-16 grid grid-cols-1 md:grid-cols-2 mx-auto px-6 max-w-7xl">
            <div className="order-2 md:order-1">
              <img
                src={`https://picsum.photos/seed/${activeDivision}feat/800/600`}
                alt="Feature"
                className="opacity-80 shadow-2xl rounded-2xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="mb-6 font-bold text-white text-3xl">
                {isTech ? "Audit Gratuit : Êtes-vous prêt pour l'IA ?" : "Audit de Marque Gratuit"}
              </h2>
              <p className="mb-8 text-gray-400 text-lg">
                {isTech ? "Découvrez comment nos agents IA peuvent réduire votre charge de support client de 70%." : "Analysez votre présence actuelle et découvrez les leviers de croissance inexploités."}
              </p>
              <Link to="/contact" className={`px-8 py-3 rounded-lg font-bold text-white bg-gradient-to-r ${config.gradient} hover:opacity-90 transition-opacity`}>
                {isTech ? "Demander un Audit" : "Télécharger"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials */}
      {isStudio ? (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 font-bold text-white text-3xl text-center"
            id="testimonials-heading"
          >
            Témoignages Clients
          </motion.h2>
          <div className="relative">
            <motion.button
              onClick={() => setTestimonialIndex((prev) => (prev - 1 + 3) % 3)}
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
              className="top-1/2 -left-4 z-10 absolute flex justify-center items-center hover:bg-fuchsia-500/50 rounded-full w-10 h-10 text-white transition-colors -translate-y-1/2"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setTestimonialIndex((prev) => (prev + 1) % 3)}
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
              className="top-1/2 -right-4 z-10 absolute flex justify-center items-center hover:bg-fuchsia-500/50 rounded-full w-10 h-10 text-white transition-colors -translate-y-1/2"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
            <div className="flex gap-8 pb-4 overflow-x-auto scrollbar-hide">
              {[
                { name: 'Thomas Renard', role: 'CEO', company: 'TechNova', photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBivK8tFIZWq2wpqNfyRqzfSSAmazMS5XXiF3TzhHRS7zErEcMiph5WJZJZzdvsPowhePbiDYPn9FvLMbGH0fwqxOkJS2_Uby9Nb85SoAChtifRcwapkxVdZ3ik2oVvWbXOOalvxkIMqTCJvVZrsb9h0hQQYv04NqVga-Pv_mavG4mRi9x1tOoBgUispCmRnXDIkfTPA7_SoB4OKc7bKimcdcT1lrYSVgXci1ASQLerdNw-Lu0hx67B0HTyjC1cqcBiaucUASP6NcI', content: "Production de qualité professionnelle, équipe réactive et créative. Nous collaborons sur plusieurs projets et recommandons leurs services professionnels." },
                { name: 'Laure Petit', role: 'Marketing Dir', company: 'Ethereal', photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaLGjNp2QDUYZPoihfIylIXEQ-Wufvap1mBatvgdG1UouJKacTHpypf6Ice37hmhlsIz1vWC4m2TO0z9dgsFu6VROb5kACkRPNn1oXzBRouoCwtjCBK5el50Sy1irFKsTkwehSwqMnHwDISxpg31r0wtm0SMm5HfFzf6cvwMBOhrNVQv-3LRCiRyZWgvVPqcN_4icClMX1G7v6-iJg1x_NEgDS-tu1iaIPIbUmUMYPqi8A-pQqwcbrT-dC6SgYJbxNSe8j1ZGTJRg', content: "Production d'élite et amet, sceloooeonotice, preebntly et coemernon tepicopebonoe. Lecôme resultas." },
                { name: 'Laura Petit', role: 'Marketing Dir', company: 'Ethereal', photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaLGjNp2QDUYZPoihfIylIXEQ-Wufvap1mBatvgdG1UouJKacTHpypf6Ice37hmhlsIz1vWC4m2TO0z9dgsFu6VROb5kACkRPNn1oXzBRouoCwtjCBK5el50Sy1irFKsTkwehSwqMnHwDISxpg31r0wtm0SMm5HfFzf6cvwMBOhrNVQv-3LRCiRyZWgvVPqcN_4icClMX1G7v6-iJg1x_NEgDS-tu1iaIPIbUmUMYPqi8A-pQqwcbrT-dC6SgYJbxNSe8j1ZGTJRg', content: "Production d'élite et amet, sceloooeonotice, preebntly et coemernon tepicopebonoe. Lecôme resultas." },
                { name: 'Thomas Renard', role: 'CEO', company: 'TechNova', photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBivK8tFIZWq2wpqNfyRqzfSSAmazMS5XXiF3TzhHRS7zErEcMiph5WJZJZzdvsPowhePbiDYPn9FvLMbGH0fwqxOkJS2_Uby9Nb85SoAChtifRcwapkxVdZ3ik2oVvWbXOOalvxkIMqTCJvVZrsb9h0hQQYv04NqVga-Pv_mavG4mRi9x1tOoBgUispCmRnXDIkfTPA7_SoB4OKc7bKimcdcT1lrYSVgXci1ASQLerdNw-Lu0hx67B0HTyjC1cqcBiaucUASP6NcI', content: "Production de qualité professionnelle, équipe réactive et créative. Nous collaborons sur plusieurs projets et recommandons leurs services professionnels." },
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex-shrink-0 bg-gray-200 p-6 rounded-2xl w-full sm:w-[45%] lg:w-[31%]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.img
                      alt={`Portrait of ${testimonial.name}`}
                      className="rounded-full w-12 h-12 object-cover"
                      src={testimonial.photo}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                      <p className="text-gray-900 text-sm">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-900">{testimonial.content}</p>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center gap-2 mt-8"
            >
              {[0, 1, 2].map((idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: idx === testimonialIndex ? 1.3 : 1,
                    backgroundColor: idx === testimonialIndex ? '#d946ef' : '#4b5563'
                  }}
                  className="rounded-full w-2.5 h-2.5"
                />
              ))}
            </motion.div>
          </div>
        </motion.section>
      ) : (
        <div className="mx-auto px-6 py-24 max-w-7xl">
          <Testimonials filterByDivision={activeDivision} showAll={false} />
        </div>
      )}

      {/* Contact Us Section - Studio Only */}
      {isStudio && (
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 font-bold text-white text-3xl md:text-left text-center"
            id="contact-heading"
          >
            Contactez-nous
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex md:flex-row flex-col gap-12 lg:gap-24"
          >
            <motion.form
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 w-full md:w-2/3"
            >
              <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <label className="block mb-2 font-medium text-[#D1D1D1] text-sm" htmlFor="name">Nom</label>
                  <motion.input
                    whileFocus={{ scale: 1.02, borderColor: '#d946ef' }}
                    className="bg-[#191522] px-4 py-2 border-gray-700 focus:border-fuchsia-500 rounded-lg focus:ring-fuchsia-500 w-full text-white transition-all"
                    id="name"
                    name="name"
                    placeholder="Nom"
                    type="text"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <label className="block mb-2 font-medium text-[#D1D1D1] text-sm" htmlFor="email">Email</label>
                  <motion.input
                    whileFocus={{ scale: 1.02, borderColor: '#d946ef' }}
                    className="bg-[#191522] px-4 py-2 border-gray-700 focus:border-fuchsia-500 rounded-lg focus:ring-fuchsia-500 w-full text-white transition-all"
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                  />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <label className="block mb-2 font-medium text-[#D1D1D1] text-sm" htmlFor="project-type">Type de Projet</label>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#d946ef' }}
                  className="bg-[#191522] px-4 py-2 border-gray-700 focus:border-fuchsia-500 rounded-lg focus:ring-fuchsia-500 w-full text-white transition-all"
                  id="project-type"
                  name="project-type"
                  type="text"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <label className="block mb-2 font-medium text-[#D1D1D1] text-sm" htmlFor="message">Message</label>
                <motion.textarea
                  whileFocus={{ scale: 1.02, borderColor: '#d946ef' }}
                  className="bg-[#191522] px-4 py-2 border-gray-700 focus:border-fuchsia-500 rounded-lg focus:ring-fuchsia-500 w-full text-white transition-all"
                  id="message"
                  name="message"
                  placeholder="Message"
                  rows={4}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/contact"
                    className={`bg-gradient-to-r ${config.gradient} text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:brightness-110 transition-all inline-block`}
                  >
                    Envoyer le Message
                  </Link>
                </motion.div>
              </motion.div>
            </motion.form>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8 w-full md:w-1/3"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <h3 className="mb-3 font-semibold text-white text-lg">Informations de contact</h3>
                <div className="space-y-2 text-[#D1D1D1]">
                  <motion.p
                    className="flex items-center gap-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Phone className={`h-5 w-5 ${config.color}`} />
                    <span>+25 456 78 50</span>
                  </motion.p>
                  <motion.p
                    className="flex items-center gap-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Mail className={`h-5 w-5 ${config.color}`} />
                    <span>contact@aureus.com</span>
                  </motion.p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <h3 className="mb-3 font-semibold text-white text-lg">Réseaux sociaux</h3>
                <div className="flex items-center gap-4">
                  <motion.a
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-8 h-8 flex items-center justify-center bg-[#191522] rounded-full text-white hover:bg-fuchsia-500 transition-colors`}
                    href="#"
                  >
                    <Twitter className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-8 h-8 flex items-center justify-center bg-[#191522] rounded-full text-white hover:bg-fuchsia-500 transition-colors`}
                    href="#"
                  >
                    <Github className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-8 h-8 flex items-center justify-center bg-[#191522] rounded-full text-white hover:bg-fuchsia-500 transition-colors`}
                    href="#"
                  >
                    <Linkedin className="w-4 h-4" />
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>
      )}

      {/* Cross Pollination */}
      <div className="mx-auto px-6 py-24 max-w-7xl text-center">
        <div className="inline-block bg-gradient-to-r from-gray-800 to-black p-1 rounded-full">
          <div className="flex items-center space-x-4 bg-[#050510] px-8 py-4 rounded-full">
            <span className="text-gray-300">{crossPollination[activeDivision].text}</span>
            <Link
              to={`/solutions?division=${crossPollination[activeDivision].target}`}
              className={`font-bold flex items-center space-x-1 ${DIVISION_CONFIG[crossPollination[activeDivision].target].color}`}
            >
              <span>{crossPollination[activeDivision].linkText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};