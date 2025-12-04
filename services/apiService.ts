import axios, { AxiosInstance } from 'axios';
import { Project, Lead, BlogPost, Division } from '../types';
import { PricingPackage, FAQItem } from './mockDataService';

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

let mockPricingPackages: PricingPackage[] = [
  { id: '1', title: 'Starter Web', division: 'TECH', price: '2,500€', priceNote: 'Paiement unique', description: 'Parfait pour lancer votre présence en ligne', deliveryTime: '3-4 semaines', revisions: '2 rounds', features: ['Site Vitrine Next.js (5 pages max)', 'SEO de base', 'Hébergement configuré (1 an inclus)'] },
  { id: '2', title: 'Business SaaS', division: 'TECH', price: '8,500€', popular: true, highlight: true, features: ['Application web full-stack', 'Authentification & gestion utilisateurs', 'Base de données PostgreSQL'] },
];

let mockFAQs: FAQItem[] = [
  { id: '1', question: 'Les prix incluent-ils les taxes ?', answer: 'Tous nos prix sont indiqués hors taxes (HT). La TVA de 20% s\'applique selon votre situation.' },
  { id: '2', question: 'Proposez-vous des paiements échelonnés ?', answer: 'Oui, pour les projets supérieurs à 5,000€, nous proposons un paiement en 2-3 fois.' },
];

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear auth and redirect
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API Service
export const apiService = {
  // ============ PROJECTS ============
  projects: {
    getAll: async (): Promise<Project[]> => {
      await delay(300);
      // In production: return (await apiClient.get<Project[]>('/projects')).data;
      return [...mockProjects];
    },
    
    getById: async (id: string): Promise<Project> => {
      await delay(300);
      // In production: return (await apiClient.get<Project>(`/projects/${id}`)).data;
      const project = mockProjects.find(p => p.id === id);
      if (!project) throw new Error('Project not found');
      return project;
    },
    
    create: async (project: Omit<Project, 'id'>): Promise<Project> => {
      await delay(500);
      // In production: return (await apiClient.post<Project>('/projects', project)).data;
      const newProject: Project = { ...project, id: Date.now().toString() };
      mockProjects.push(newProject);
      return newProject;
    },
    
    update: async (id: string, updates: Partial<Project>): Promise<Project> => {
      await delay(500);
      // In production: return (await apiClient.patch<Project>(`/projects/${id}`, updates)).data;
      const index = mockProjects.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Project not found');
      mockProjects[index] = { ...mockProjects[index], ...updates };
      return mockProjects[index];
    },
    
    delete: async (id: string): Promise<void> => {
      await delay(300);
      // In production: await apiClient.delete(`/projects/${id}`);
      mockProjects = mockProjects.filter(p => p.id !== id);
    },
  },

  // ============ LEADS ============
  leads: {
    getAll: async (): Promise<Lead[]> => {
      await delay(300);
      // In production: return (await apiClient.get<Lead[]>('/leads')).data;
      return [...mockLeads];
    },
    
    getById: async (id: string): Promise<Lead> => {
      await delay(300);
      // In production: return (await apiClient.get<Lead>(`/leads/${id}`)).data;
      const lead = mockLeads.find(l => l.id === id);
      if (!lead) throw new Error('Lead not found');
      return lead;
    },
    
    create: async (lead: Omit<Lead, 'id' | 'date' | 'status'>): Promise<Lead> => {
      await delay(500);
      // In production: return (await apiClient.post<Lead>('/leads', lead)).data;
      const newLead: Lead = {
        ...lead,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        status: 'new',
      };
      mockLeads.push(newLead);
      return newLead;
    },
    
    update: async (id: string, updates: Partial<Lead>): Promise<Lead> => {
      await delay(500);
      // In production: return (await apiClient.patch<Lead>(`/leads/${id}`, updates)).data;
      const index = mockLeads.findIndex(l => l.id === id);
      if (index === -1) throw new Error('Lead not found');
      mockLeads[index] = { ...mockLeads[index], ...updates };
      return mockLeads[index];
    },
    
    updateStatus: async (id: string, status: Lead['status']): Promise<Lead> => {
      await delay(300);
      // In production: return (await apiClient.patch<Lead>(`/leads/${id}`, { status })).data;
      const index = mockLeads.findIndex(l => l.id === id);
      if (index === -1) throw new Error('Lead not found');
      mockLeads[index].status = status;
      return mockLeads[index];
    },
    
    delete: async (id: string): Promise<void> => {
      await delay(300);
      // In production: await apiClient.delete(`/leads/${id}`);
      mockLeads = mockLeads.filter(l => l.id !== id);
    },
  },

  // ============ BLOG POSTS ============
  blogPosts: {
    getAll: async (): Promise<BlogPost[]> => {
      await delay(300);
      // In production: return (await apiClient.get<BlogPost[]>('/blog-posts')).data;
      return [...mockBlogPosts];
    },
    
    getById: async (id: string): Promise<BlogPost> => {
      await delay(300);
      // In production: return (await apiClient.get<BlogPost>(`/blog-posts/${id}`)).data;
      const post = mockBlogPosts.find(p => p.id === id);
      if (!post) throw new Error('Blog post not found');
      return post;
    },
    
    getBySlug: async (slug: string): Promise<BlogPost> => {
      await delay(300);
      // In production: return (await apiClient.get<BlogPost>(`/blog-posts/slug/${slug}`)).data;
      const post = mockBlogPosts.find(p => p.slug === slug);
      if (!post) throw new Error('Blog post not found');
      return post;
    },
    
    create: async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
      await delay(500);
      // In production: return (await apiClient.post<BlogPost>('/blog-posts', post)).data;
      const newPost: BlogPost = { ...post, id: Date.now().toString() };
      mockBlogPosts.push(newPost);
      return newPost;
    },
    
    update: async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
      await delay(500);
      // In production: return (await apiClient.patch<BlogPost>(`/blog-posts/${id}`, updates)).data;
      const index = mockBlogPosts.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Blog post not found');
      mockBlogPosts[index] = { ...mockBlogPosts[index], ...updates };
      return mockBlogPosts[index];
    },
    
    delete: async (id: string): Promise<void> => {
      await delay(300);
      // In production: await apiClient.delete(`/blog-posts/${id}`);
      mockBlogPosts = mockBlogPosts.filter(p => p.id !== id);
    },
  },

  // ============ PRICING PACKAGES ============
  pricingPackages: {
    getAll: async (): Promise<PricingPackage[]> => {
      await delay(300);
      // In production: return (await apiClient.get<PricingPackage[]>('/pricing-packages')).data;
      return [...mockPricingPackages];
    },
    
    getById: async (id: string): Promise<PricingPackage> => {
      await delay(300);
      // In production: return (await apiClient.get<PricingPackage>(`/pricing-packages/${id}`)).data;
      const pkg = mockPricingPackages.find(p => p.id === id);
      if (!pkg) throw new Error('Pricing package not found');
      return pkg;
    },
    
    create: async (pkg: Omit<PricingPackage, 'id'>): Promise<PricingPackage> => {
      await delay(500);
      // In production: return (await apiClient.post<PricingPackage>('/pricing-packages', pkg)).data;
      const newPkg: PricingPackage = { ...pkg, id: Date.now().toString() };
      mockPricingPackages.push(newPkg);
      return newPkg;
    },
    
    update: async (id: string, updates: Partial<PricingPackage>): Promise<PricingPackage> => {
      await delay(500);
      // In production: return (await apiClient.patch<PricingPackage>(`/pricing-packages/${id}`, updates)).data;
      const index = mockPricingPackages.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Pricing package not found');
      mockPricingPackages[index] = { ...mockPricingPackages[index], ...updates };
      return mockPricingPackages[index];
    },
    
    delete: async (id: string): Promise<void> => {
      await delay(300);
      // In production: await apiClient.delete(`/pricing-packages/${id}`);
      mockPricingPackages = mockPricingPackages.filter(p => p.id !== id);
    },
  },

  // ============ FAQs ============
  faqs: {
    getAll: async (): Promise<FAQItem[]> => {
      await delay(300);
      // In production: return (await apiClient.get<FAQItem[]>('/faqs')).data;
      return [...mockFAQs];
    },
    
    getById: async (id: string): Promise<FAQItem> => {
      await delay(300);
      // In production: return (await apiClient.get<FAQItem>(`/faqs/${id}`)).data;
      const faq = mockFAQs.find(f => f.id === id);
      if (!faq) throw new Error('FAQ not found');
      return faq;
    },
    
    create: async (faq: Omit<FAQItem, 'id'>): Promise<FAQItem> => {
      await delay(500);
      // In production: return (await apiClient.post<FAQItem>('/faqs', faq)).data;
      const newFAQ: FAQItem = { ...faq, id: Date.now().toString() };
      mockFAQs.push(newFAQ);
      return newFAQ;
    },
    
    update: async (id: string, updates: Partial<FAQItem>): Promise<FAQItem> => {
      await delay(500);
      // In production: return (await apiClient.patch<FAQItem>(`/faqs/${id}`, updates)).data;
      const index = mockFAQs.findIndex(f => f.id === id);
      if (index === -1) throw new Error('FAQ not found');
      mockFAQs[index] = { ...mockFAQs[index], ...updates };
      return mockFAQs[index];
    },
    
    delete: async (id: string): Promise<void> => {
      await delay(300);
      // In production: await apiClient.delete(`/faqs/${id}`);
      mockFAQs = mockFAQs.filter(f => f.id !== id);
    },
  },

  // ============ AUTH ============
  auth: {
    login: async (username: string, password: string): Promise<{ success: boolean; user?: { username: string; email: string }; error?: string; token?: string }> => {
      await delay(800);
      // In production: 
      // const response = await apiClient.post('/auth/login', { username, password });
      // return response.data;
      
      const MOCK_USER = {
        username: 'admin',
        password: 'admin123',
        email: 'admin@aureus.com'
      };
      
      if (username === MOCK_USER.username && password === MOCK_USER.password) {
        const user = { username: MOCK_USER.username, email: MOCK_USER.email };
        const token = 'mock_token_' + Date.now();
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_token', token);
        return { success: true, user, token };
      }
      
      return { success: false, error: 'Identifiants incorrects' };
    },
    
    logout: async (): Promise<void> => {
      await delay(200);
      // In production: await apiClient.post('/auth/logout');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    },
    
    getCurrentUser: async (): Promise<{ username: string; email: string } | null> => {
      await delay(200);
      // In production: return (await apiClient.get('/auth/me')).data;
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
      return null;
    },
    
    isAuthenticated: (): boolean => {
      return !!localStorage.getItem('auth_token');
    },
  },
};

export default apiService;


