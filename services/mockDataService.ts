import { Project, Lead, BlogPost, Division } from '../types';

// Mock data storage (in production, this would be API calls)
let mockProjects: Project[] = [
  { id: '1', title: 'Nebula SaaS', client: 'Nebula Inc', division: Division.TECH, tags: ['React', 'Python', 'IA'], imageUrl: 'https://picsum.photos/seed/nebula/600/400', description: 'Tableau de bord entreprise.' },
  { id: '2', title: 'Lancement Nike Air', client: 'Nike', division: Division.STUDIO, tags: ['VFX', '3D', 'Montage'], imageUrl: 'https://picsum.photos/seed/nike/600/400', description: 'Campagne publicitaire mondiale.' },
];

let mockLeads: Lead[] = [
  { id: '1', name: 'Alice Smith', email: 'alice@test.com', message: 'Besoin d\'une application.', interest_division: Division.TECH, status: 'new', date: '2023-10-01' },
  { id: '2', name: 'Bob Jones', email: 'bob@test.com', message: 'Tournage commercial.', interest_division: Division.STUDIO, status: 'contacted', date: '2023-10-02' },
];

let mockBlogPosts: BlogPost[] = [
  { id: '1', title: 'Comment les agents IA remplacent le support traditionnel', excerpt: 'L\'automatisation n\'est pas le futur, c\'est le présent. Découvrez comment réduire vos coûts de 40%.', category: 'Tendances Tech', date: '12 Oct 2023', imageUrl: 'https://picsum.photos/seed/ai/800/600', slug: 'ai-agents-support' },
  { id: '2', title: 'Pourquoi l\'étalonnage compte pour votre image de marque', excerpt: 'La psychologie des couleurs au cinéma appliquée au branding d\'entreprise.', category: 'Coin Créateur', date: '08 Oct 2023', imageUrl: 'https://picsum.photos/seed/color/800/600', slug: 'color-grading-brand' },
  { id: '3', title: 'Next.js 14 : Ce qui change pour votre site web', excerpt: 'Performance, SEO et Server Actions. Pourquoi migrer maintenant.', category: 'Ingénierie', date: '01 Oct 2023', imageUrl: 'https://picsum.photos/seed/next/800/600', slug: 'nextjs-14-update' },
];

export interface PricingPackage {
  id: string;
  title: string;
  division: string;
  price: string;
  priceNote?: string;
  features: string[];
  highlight?: boolean;
  popular?: boolean;
  description?: string;
  deliveryTime?: string;
  revisions?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

let mockPricingPackages: PricingPackage[] = [
  { id: '1', title: 'Starter Web', division: 'TECH', price: '2,500€', priceNote: 'Paiement unique', description: 'Parfait pour lancer votre présence en ligne', deliveryTime: '3-4 semaines', revisions: '2 rounds', features: ['Site Vitrine Next.js (5 pages max)', 'SEO de base', 'Hébergement configuré (1 an inclus)'] },
  { id: '2', title: 'Business SaaS', division: 'TECH', price: '8,500€', popular: true, highlight: true, features: ['Application web full-stack', 'Authentification & gestion utilisateurs', 'Base de données PostgreSQL'] },
];

let mockFAQs: FAQItem[] = [
  { id: '1', question: 'Les prix incluent-ils les taxes ?', answer: 'Tous nos prix sont indiqués hors taxes (HT). La TVA de 20% s\'applique selon votre situation.' },
  { id: '2', question: 'Proposez-vous des paiements échelonnés ?', answer: 'Oui, pour les projets supérieurs à 5,000€, nous proposons un paiement en 2-3 fois.' },
];

export const mockDataService = {
  // Projects
  getProjects: async (): Promise<Project[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockProjects];
  },
  
  createProject: async (project: Omit<Project, 'id'>): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProject: Project = { ...project, id: Date.now().toString() };
    mockProjects.push(newProject);
    return newProject;
  },
  
  updateProject: async (id: string, updates: Partial<Project>): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProjects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    mockProjects[index] = { ...mockProjects[index], ...updates };
    return mockProjects[index];
  },
  
  deleteProject: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockProjects = mockProjects.filter(p => p.id !== id);
  },

  // Leads
  getLeads: async (): Promise<Lead[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockLeads];
  },
  
  updateLeadStatus: async (id: string, status: Lead['status']): Promise<Lead> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockLeads.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lead not found');
    mockLeads[index].status = status;
    return mockLeads[index];
  },
  
  deleteLead: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockLeads = mockLeads.filter(l => l.id !== id);
  },

  // Blog Posts
  getBlogPosts: async (): Promise<BlogPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockBlogPosts];
  },
  
  createBlogPost: async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPost: BlogPost = { ...post, id: Date.now().toString() };
    mockBlogPosts.push(newPost);
    return newPost;
  },
  
  updateBlogPost: async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockBlogPosts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Blog post not found');
    mockBlogPosts[index] = { ...mockBlogPosts[index], ...updates };
    return mockBlogPosts[index];
  },
  
  deleteBlogPost: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockBlogPosts = mockBlogPosts.filter(p => p.id !== id);
  },

  // Pricing Packages
  getPricingPackages: async (): Promise<PricingPackage[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockPricingPackages];
  },
  
  createPricingPackage: async (pkg: Omit<PricingPackage, 'id'>): Promise<PricingPackage> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPkg: PricingPackage = { ...pkg, id: Date.now().toString() };
    mockPricingPackages.push(newPkg);
    return newPkg;
  },
  
  updatePricingPackage: async (id: string, updates: Partial<PricingPackage>): Promise<PricingPackage> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPricingPackages.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Pricing package not found');
    mockPricingPackages[index] = { ...mockPricingPackages[index], ...updates };
    return mockPricingPackages[index];
  },
  
  deletePricingPackage: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockPricingPackages = mockPricingPackages.filter(p => p.id !== id);
  },

  // FAQs
  getFAQs: async (): Promise<FAQItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockFAQs];
  },
  
  createFAQ: async (faq: Omit<FAQItem, 'id'>): Promise<FAQItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newFAQ: FAQItem = { ...faq, id: Date.now().toString() };
    mockFAQs.push(newFAQ);
    return newFAQ;
  },
  
  updateFAQ: async (id: string, updates: Partial<FAQItem>): Promise<FAQItem> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockFAQs.findIndex(f => f.id === id);
    if (index === -1) throw new Error('FAQ not found');
    mockFAQs[index] = { ...mockFAQs[index], ...updates };
    return mockFAQs[index];
  },
  
  deleteFAQ: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockFAQs = mockFAQs.filter(f => f.id !== id);
  },
};

