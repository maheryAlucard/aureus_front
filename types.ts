export enum Division {
  TECH = 'TECH',
  STUDIO = 'STUDIO',
  BRAND = 'BRAND'
}

export interface Project {
  id: string;
  title: string;
  client: string;
  division: Division;
  tags: string[];
  imageUrl: string;
  description: string;
}

export interface Lead {
  id: string;
  email: string;
  name: string;
  message: string;
  interest_division: Division;
  status: 'new' | 'contacted' | 'closed';
  date: string;
  budget?: string;
  eventDate?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  slug: string;
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
}

export interface Devis {
  id: string;
  clientName: string;
  clientEmail: string;
  companyName?: string;
  division: Division;
  projectDescription: string;
  budget?: string;
  deadline?: string;
  additionalRequirements?: string;
  generatedContent: string;
  createdAt: string;
  userId: string;
}

export const DIVISION_CONFIG = {
  [Division.TECH]: {
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/50',
    gradient: 'from-cyan-500 to-blue-600',
    label: 'Aureus Tech',
    slogan: 'Bâtir & Automatiser',
    desc: 'Code & Logique',
    icon: 'Code',
    subServices: [
      { title: 'Dév Web & App', desc: 'Sites sur mesure, PWA, iOS/Android.' },
      { title: 'Automatisation & IA', desc: 'Workflows Make/Zapier, Agents IA, Chatbots.' },
      { title: 'Consulting Tech', desc: 'Transformation digitale & Audit.' }
    ]
  },
  [Division.STUDIO]: {
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/50',
    gradient: 'from-fuchsia-500 to-pink-600',
    label: 'Aureus Studio',
    slogan: 'Créer & Capturer',
    desc: 'Mouvement & Visuels',
    icon: 'Film',
    subServices: [
      { title: 'Événementiel & Live', desc: 'Mariages, Corporate, Festivals.' },
      { title: 'Musique & Narration', desc: 'Clips, Courts-métrages, Documentaires.' },
      { title: 'Post-Prod & VFX', desc: 'Étalonnage, Rotoscopie, Montage.' }
    ]
  },
  [Division.BRAND]: {
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/50',
    gradient: 'from-indigo-500 to-violet-600',
    label: 'Aureus Brand',
    slogan: 'Croître & Engager',
    desc: 'Identité & Croissance',
    icon: 'Zap',
    subServices: [
      { title: 'Identité Visuelle', desc: 'Logos, Charte Graphique, UI Kits.' },
      { title: 'Community Management', desc: 'Stratégie Social Media, Planning Éditorial.' },
      { title: 'Growth Marketing', desc: 'Acquisition & Fidélisation.' }
    ]
  }
};