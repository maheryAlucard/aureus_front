import { create } from 'zustand';
import { Project, Lead, BlogPost, Testimonial, TeamMember, Devis } from '../types';
import { PricingPackage, FAQItem } from '../services/mockDataService';

// Store state interface
interface AppState {
  // Projects
  projects: Project[];
  projectsLoading: boolean;
  projectsError: string | null;
  
  // Leads
  leads: Lead[];
  leadsLoading: boolean;
  leadsError: string | null;
  
  // Blog Posts
  blogPosts: BlogPost[];
  blogPostsLoading: boolean;
  blogPostsError: string | null;
  
  // Pricing Packages
  pricingPackages: PricingPackage[];
  pricingPackagesLoading: boolean;
  pricingPackagesError: string | null;
  
  // FAQs
  faqs: FAQItem[];
  faqsLoading: boolean;
  faqsError: string | null;
  
  // Testimonials
  testimonials: Testimonial[];
  testimonialsLoading: boolean;
  testimonialsError: string | null;
  
  // Team Members
  teamMembers: TeamMember[];
  teamMembersLoading: boolean;
  teamMembersError: string | null;
  
  // Devis
  devis: Devis[];
  devisLoading: boolean;
  devisError: string | null;
  
  // Auth
  user: { username: string; email: string } | null;
  authLoading: boolean;
  authError: string | null;
  isAuthenticated: boolean;
}

// Store actions interface
interface AppActions {
  // Projects actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setProjectsLoading: (loading: boolean) => void;
  setProjectsError: (error: string | null) => void;
  
  // Leads actions
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  removeLead: (id: string) => void;
  setLeadsLoading: (loading: boolean) => void;
  setLeadsError: (error: string | null) => void;
  
  // Blog Posts actions
  setBlogPosts: (posts: BlogPost[]) => void;
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  removeBlogPost: (id: string) => void;
  setBlogPostsLoading: (loading: boolean) => void;
  setBlogPostsError: (error: string | null) => void;
  
  // Pricing Packages actions
  setPricingPackages: (packages: PricingPackage[]) => void;
  addPricingPackage: (pkg: PricingPackage) => void;
  updatePricingPackage: (id: string, updates: Partial<PricingPackage>) => void;
  removePricingPackage: (id: string) => void;
  setPricingPackagesLoading: (loading: boolean) => void;
  setPricingPackagesError: (error: string | null) => void;
  
  // FAQs actions
  setFAQs: (faqs: FAQItem[]) => void;
  addFAQ: (faq: FAQItem) => void;
  updateFAQ: (id: string, updates: Partial<FAQItem>) => void;
  removeFAQ: (id: string) => void;
  setFAQsLoading: (loading: boolean) => void;
  setFAQsError: (error: string | null) => void;
  
  // Testimonials actions
  setTestimonials: (testimonials: Testimonial[]) => void;
  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  removeTestimonial: (id: string) => void;
  setTestimonialsLoading: (loading: boolean) => void;
  setTestimonialsError: (error: string | null) => void;
  
  // Team Members actions
  setTeamMembers: (members: TeamMember[]) => void;
  addTeamMember: (member: TeamMember) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (id: string) => void;
  setTeamMembersLoading: (loading: boolean) => void;
  setTeamMembersError: (error: string | null) => void;
  
  // Devis actions
  setDevis: (devis: Devis[]) => void;
  addDevis: (devis: Devis) => void;
  updateDevis: (id: string, updates: Partial<Devis>) => void;
  removeDevis: (id: string) => void;
  setDevisLoading: (loading: boolean) => void;
  setDevisError: (error: string | null) => void;
  
  // Auth actions
  setUser: (user: { username: string; email: string } | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
}

type AppStore = AppState & AppActions;

// Initial state
const initialState: AppState = {
  projects: [],
  projectsLoading: false,
  projectsError: null,
  leads: [],
  leadsLoading: false,
  leadsError: null,
  blogPosts: [],
  blogPostsLoading: false,
  blogPostsError: null,
  pricingPackages: [],
  pricingPackagesLoading: false,
  pricingPackagesError: null,
  faqs: [],
  faqsLoading: false,
  faqsError: null,
  testimonials: [],
  testimonialsLoading: false,
  testimonialsError: null,
  teamMembers: [],
  teamMembersLoading: false,
  teamMembersError: null,
  devis: [],
  devisLoading: false,
  devisError: null,
  user: null,
  authLoading: false,
  authError: null,
  isAuthenticated: false,
};

// Create Zustand store
export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  
  // Projects actions
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
  })),
  setProjectsLoading: (loading) => set({ projectsLoading: loading }),
  setProjectsError: (error) => set({ projectsError: error }),
  
  // Leads actions
  setLeads: (leads) => set({ leads }),
  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  updateLead: (id, updates) => set((state) => ({
    leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
  })),
  removeLead: (id) => set((state) => ({
    leads: state.leads.filter((l) => l.id !== id),
  })),
  setLeadsLoading: (loading) => set({ leadsLoading: loading }),
  setLeadsError: (error) => set({ leadsError: error }),
  
  // Blog Posts actions
  setBlogPosts: (posts) => set({ blogPosts: posts }),
  addBlogPost: (post) => set((state) => ({ blogPosts: [...state.blogPosts, post] })),
  updateBlogPost: (id, updates) => set((state) => ({
    blogPosts: state.blogPosts.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  removeBlogPost: (id) => set((state) => ({
    blogPosts: state.blogPosts.filter((p) => p.id !== id),
  })),
  setBlogPostsLoading: (loading) => set({ blogPostsLoading: loading }),
  setBlogPostsError: (error) => set({ blogPostsError: error }),
  
  // Pricing Packages actions
  setPricingPackages: (packages) => set({ pricingPackages: packages }),
  addPricingPackage: (pkg) => set((state) => ({ pricingPackages: [...state.pricingPackages, pkg] })),
  updatePricingPackage: (id, updates) => set((state) => ({
    pricingPackages: state.pricingPackages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  removePricingPackage: (id) => set((state) => ({
    pricingPackages: state.pricingPackages.filter((p) => p.id !== id),
  })),
  setPricingPackagesLoading: (loading) => set({ pricingPackagesLoading: loading }),
  setPricingPackagesError: (error) => set({ pricingPackagesError: error }),
  
  // FAQs actions
  setFAQs: (faqs) => set({ faqs }),
  addFAQ: (faq) => set((state) => ({ faqs: [...state.faqs, faq] })),
  updateFAQ: (id, updates) => set((state) => ({
    faqs: state.faqs.map((f) => (f.id === id ? { ...f, ...updates } : f)),
  })),
  removeFAQ: (id) => set((state) => ({
    faqs: state.faqs.filter((f) => f.id !== id),
  })),
  setFAQsLoading: (loading) => set({ faqsLoading: loading }),
  setFAQsError: (error) => set({ faqsError: error }),
  
  // Testimonials actions
  setTestimonials: (testimonials) => set({ testimonials }),
  addTestimonial: (testimonial) => set((state) => ({ testimonials: [...state.testimonials, testimonial] })),
  updateTestimonial: (id, updates) => set((state) => ({
    testimonials: state.testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),
  removeTestimonial: (id) => set((state) => ({
    testimonials: state.testimonials.filter((t) => t.id !== id),
  })),
  setTestimonialsLoading: (loading) => set({ testimonialsLoading: loading }),
  setTestimonialsError: (error) => set({ testimonialsError: error }),
  
  // Team Members actions
  setTeamMembers: (members) => set({ teamMembers: members }),
  addTeamMember: (member) => set((state) => ({ teamMembers: [...state.teamMembers, member] })),
  updateTeamMember: (id, updates) => set((state) => ({
    teamMembers: state.teamMembers.map((m) => (m.id === id ? { ...m, ...updates } : m)),
  })),
  removeTeamMember: (id) => set((state) => ({
    teamMembers: state.teamMembers.filter((m) => m.id !== id),
  })),
  setTeamMembersLoading: (loading) => set({ teamMembersLoading: loading }),
  setTeamMembersError: (error) => set({ teamMembersError: error }),
  
  // Devis actions
  setDevis: (devis) => set({ devis }),
  addDevis: (devis) => set((state) => ({ devis: [...state.devis, devis] })),
  updateDevis: (id, updates) => set((state) => ({
    devis: state.devis.map((d) => (d.id === id ? { ...d, ...updates } : d)),
  })),
  removeDevis: (id) => set((state) => ({
    devis: state.devis.filter((d) => d.id !== id),
  })),
  setDevisLoading: (loading) => set({ devisLoading: loading }),
  setDevisError: (error) => set({ devisError: error }),
  
  // Auth actions
  setUser: (user) => set({ user }),
  setAuthLoading: (loading) => set({ authLoading: loading }),
  setAuthError: (error) => set({ authError: error }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  logout: () => set({
    user: null,
    isAuthenticated: false,
    authError: null,
  }),
}));


