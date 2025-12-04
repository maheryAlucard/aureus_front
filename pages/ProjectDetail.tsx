import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag, CheckCircle2 } from 'lucide-react';
import { Project, DIVISION_CONFIG } from '../types';
import { apiService } from '../services/apiService';
import { useSEO } from '../hooks/useSEO';
import { SocialShare } from '../components/SocialShare';
import { analytics } from '../utils/analytics';
import { VideoGallery } from '../components/VideoGallery';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const allProjects = await apiService.projects.getAll();
        const foundProject = allProjects.find(p => p.id === id);
        
        if (foundProject) {
          const fullProject: Project = {
            ...foundProject,
            fullDescription: foundProject.fullDescription || generateMockDescription(foundProject),
            images: foundProject.images || [foundProject.imageUrl, `https://picsum.photos/seed/${foundProject.id}-2/800/600`, `https://picsum.photos/seed/${foundProject.id}-3/800/600`],
            results: foundProject.results || [
              'Augmentation de 40% du trafic',
              'Réduction de 30% des coûts opérationnels',
              'Satisfaction client de 95%'
            ],
            technologies: foundProject.technologies || foundProject.tags
          };
          setProject(fullProject);
          
          // Find related projects
          const related = allProjects
            .filter(p => p.id !== foundProject.id && (p.division === foundProject.division || p.tags.some(t => foundProject.tags.includes(t))))
            .slice(0, 3);
          setRelatedProjects(related);
        } else {
          navigate('/work');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        navigate('/work');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  useEffect(() => {
    if (project) {
      useSEO({
        title: `${project.title} - Étude de cas`,
        description: project.fullDescription || project.description,
        image: project.imageUrl,
        type: 'article',
        tags: project.tags
      });
      
      // Track content view
      analytics.trackContentView('project', project.id, project.title);
    }
  }, [project]);

  const generateMockDescription = (project: Project): string => {
    return `
# ${project.title}

## Contexte

${project.description}

## Défi

Le client ${project.client} avait besoin d'une solution ${project.division === 'TECH' ? 'technologique' : project.division === 'STUDIO' ? 'créative' : 'de branding'} qui répondrait à leurs besoins spécifiques tout en respectant les contraintes de budget et de délai.

## Solution

Nous avons développé une approche sur mesure en utilisant les technologies les plus récentes et les meilleures pratiques de l'industrie. Notre équipe a travaillé en étroite collaboration avec le client pour garantir que chaque aspect du projet répondait à leurs attentes.

## Technologies Utilisées

${project.tags.map(tag => `- ${tag}`).join('\n')}

## Résultats

Les résultats ont dépassé les attentes initiales, avec des améliorations significatives dans tous les domaines mesurés.
    `.trim();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center px-6 pt-32 pb-20 min-h-screen">
        <div className="text-center">
          <div className="mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin" />
          <p className="text-gray-400">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const config = DIVISION_CONFIG[project.division];

  return (
    <div className="pt-32 pb-20 min-h-screen">
      {/* Header */}
      <div className="mx-auto mb-12 px-6 max-w-7xl">
        <Link
          to="/work"
          className="inline-flex items-center space-x-2 mb-8 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux réalisations</span>
        </Link>

        <div className="flex items-center space-x-4 mb-6">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.color} border ${config.border}`}>
            {config.label}
          </span>
          <span className="text-gray-500 text-sm">Client: {project.client}</span>
        </div>

        <h1 className="mb-6 font-bold text-white text-4xl md:text-6xl leading-tight">
          {project.title}
        </h1>

        <p className="mb-8 max-w-3xl text-gray-300 text-xl leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {project.tags.map(tag => (
            <span key={tag} className="bg-white/5 px-3 py-1 border border-white/10 rounded-full text-gray-300 text-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Image */}
      <div className="mx-auto mb-12 px-6 max-w-7xl">
        <div className="relative border border-white/10 rounded-2xl aspect-video overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="gap-12 grid grid-cols-1 lg:grid-cols-3 mx-auto mb-12 px-6 max-w-7xl">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="prose-invert max-w-none prose-headings:font-bold prose-strong:font-bold prose-a:text-blue-400 prose-headings:text-white prose-li:text-gray-300 prose-ol:text-gray-300 prose-p:text-gray-300 prose-strong:text-white prose-ul:text-gray-300 hover:prose-a:underline prose-a:no-underline prose-p:leading-relaxed prose prose-lg"
          >
            <div dangerouslySetInnerHTML={{ __html: project.fullDescription?.replace(/\n/g, '<br />') || project.description }} />
          </div>

          {/* Video Gallery */}
          {project.videoUrl && (
            <div className="mt-12">
              <VideoGallery
                videos={[{
                  id: project.id,
                  title: project.title,
                  src: project.videoUrl,
                  type: project.videoUrl.includes('youtube') ? 'youtube' : project.videoUrl.includes('vimeo') ? 'vimeo' : 'direct'
                }]}
              />
            </div>
          )}

          {/* Image Gallery */}
          {project.images && project.images.length > 1 && (
            <div className="gap-4 grid grid-cols-2 mt-12">
              {project.images.slice(1).map((img, idx) => (
                <div key={idx} className="relative border border-white/10 rounded-lg aspect-square overflow-hidden">
                  <img
                    src={img}
                    alt={`${project.title} - Image ${idx + 2}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="bg-[#0a0a16] p-6 border border-white/10 rounded-xl">
              <h3 className="flex items-center space-x-2 mb-4 font-bold text-white">
                <Tag className="w-5 h-5" />
                <span>Technologies</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span key={tech} className="bg-white/5 px-2 py-1 rounded text-gray-300 text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {project.results && project.results.length > 0 && (
            <div className="bg-[#0a0a16] p-6 border border-white/10 rounded-xl">
              <h3 className="flex items-center space-x-2 mb-4 font-bold text-white">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Résultats</span>
              </h3>
              <ul className="space-y-3">
                {project.results.map((result, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-gray-300 text-sm">
                    <CheckCircle2 className="mt-0.5 w-4 h-4 text-green-400 shrink-0" />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Share */}
          {project && (
            <div className="bg-[#0a0a16] p-6 border border-white/10 rounded-xl">
              <h3 className="mb-4 font-bold text-white">Partager</h3>
              <SocialShare
                title={project.title}
                description={project.description}
                contentType="project"
                contentId={project.id}
                className="flex-col space-y-3"
              />
            </div>
          )}
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="mx-auto mt-20 px-6 max-w-7xl">
          <h2 className="mb-8 font-bold text-white text-3xl">Projets Similaires</h2>
          <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
            {relatedProjects.map((relatedProject) => (
              <Link
                key={relatedProject.id}
                to={`/work/${relatedProject.id}`}
                className="group block"
              >
                <div className="relative mb-4 border border-white/10 rounded-lg aspect-[4/3] overflow-hidden">
                  <img
                    src={relatedProject.imageUrl}
                    alt={relatedProject.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <h3 className="mb-2 font-bold text-white group-hover:text-blue-400 text-xl transition-colors">
                  {relatedProject.title}
                </h3>
                <p className="text-gray-500 text-sm">{relatedProject.client}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

