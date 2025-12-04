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
  fullDescription?: string;
  images?: string[];
  videoUrl?: string;
  results?: string[];
  technologies?: string[];
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
  content?: string;
  readingTime?: number;
  tags?: string[];
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

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companyLogo?: string;
  photo?: string;
  content: string;
  rating: number;
  division?: Division;
  videoUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: Division;
  bio: string;
  photo: string;
  expertise: string[];
  linkedin?: string;
  email?: string;
  featured?: boolean;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  source: string;
  subscribedAt: string;
  unsubscribedAt?: string;
  isActive: boolean;
}

export interface SearchQuery {
  id: string;
  query: string;
  resultsCount: number;
  searchedAt: string;
  userId?: string;
}

export interface ChatHistory {
  id: string;
  userId?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface QuizResult {
  id: string;
  quizType: 'brand_audit' | 'roi_calculator' | 'other';
  answers: number[];
  score: number;
  recommendation?: string;
  metadata?: Record<string, any>;
  completedAt: string;
  userId?: string;
}

// Dynamic Content Types
export interface Metric {
  id: string;
  value: string;
  label: string;
  icon?: string;
  color?: string;
  order: number;
}

export interface MethodologyStep {
  id: string;
  step: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
}

export interface HomePageContent {
  id: string;
  heroBadge?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroDescriptionHighlight?: string;
  metrics: Metric[];
  methodologyTitle?: string;
  methodologyDescription?: string;
  methodologySteps: MethodologyStep[];
  techStackTitle?: string;
  techStackItems: string[];
  creativeStackItems: string[];
  whyUsTitle?: string;
  whyUsItems: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    color?: string;
  }>;
  teamTeaserTitle?: string;
  teamTeaserDescription?: string;
  blogSectionTitle?: string;
  blogSectionDescription?: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  footerDescription?: string;
  footerLinks: Array<{
    id: string;
    label: string;
    url: string;
    category: 'divisions' | 'company' | 'other';
  }>;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    youtube?: string;
  };
  contactEmail?: string;
  careersEmail?: string;
  seoKeywords?: string[];
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