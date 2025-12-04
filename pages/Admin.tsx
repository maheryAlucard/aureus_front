import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Division, DIVISION_CONFIG, Project, Lead, BlogPost, TeamMember, Testimonial, HomePageContent, SiteSettings } from '../types';
import { LayoutDashboard, FileText, Users, Plus, Sparkles, Loader2, Trash2, BookOpen, DollarSign, HelpCircle, LogOut, Edit2, X, Check, Menu, UserCircle, MessageSquare, Home, Settings, Star } from 'lucide-react';
import { generateProjectDescription } from '../services/geminiService';
import { mockDataService, PricingPackage, FAQItem } from '../services/mockDataService';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';

type TabType = 'projects' | 'leads' | 'blog' | 'pricing' | 'faq' | 'team' | 'testimonials' | 'home' | 'settings';

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('projects');
    const [projects, setProjects] = useState<Project[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>([]);
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [homePageContent, setHomePageContent] = useState<HomePageContent | null>(null);
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    
    // New Project State
    const [newProject, setNewProject] = useState<Partial<Project>>({
        title: '',
        client: '',
        division: Division.TECH,
        tags: [],
        description: '',
        imageUrl: 'https://picsum.photos/seed/new/600/400'
    });
    const [tagInput, setTagInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);

    // New Blog Post State
    const [newBlogPost, setNewBlogPost] = useState<Partial<BlogPost>>({
        title: '',
        excerpt: '',
        category: '',
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        imageUrl: 'https://picsum.photos/seed/blog/800/600',
        slug: ''
    });
    const [showBlogForm, setShowBlogForm] = useState(false);

    // New Pricing Package State
    const [newPricingPackage, setNewPricingPackage] = useState<Partial<PricingPackage>>({
        title: '',
        division: 'TECH',
        price: '',
        features: [],
        description: ''
    });
    const [featureInput, setFeatureInput] = useState('');
    const [showPricingForm, setShowPricingForm] = useState(false);

    // New FAQ State
    const [newFAQ, setNewFAQ] = useState<Partial<FAQItem>>({
        question: '',
        answer: ''
    });
    const [showFAQForm, setShowFAQForm] = useState(false);
    
    // Team Member State
    const [newTeamMember, setNewTeamMember] = useState<Partial<TeamMember>>({
        name: '',
        role: '',
        division: Division.TECH,
        bio: '',
        photo: 'https://i.pravatar.cc/300',
        expertise: [],
        featured: false
    });
    const [expertiseInput, setExpertiseInput] = useState('');
    const [showTeamForm, setShowTeamForm] = useState(false);

    // Testimonial State
    const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
        name: '',
        role: '',
        company: '',
        content: '',
        rating: 5,
        division: Division.TECH
    });
    const [showTestimonialForm, setShowTestimonialForm] = useState(false);

    // Home Page Content State
    const [editingHomeContent, setEditingHomeContent] = useState<Partial<HomePageContent>>({});
    const [showHomeForm, setShowHomeForm] = useState(false);
    const [metricInput, setMetricInput] = useState({ value: '', label: '', icon: '', color: '' });
    const [stepInput, setStepInput] = useState({ step: '', title: '', description: '', icon: '' });
    const [whyUsInput, setWhyUsInput] = useState({ title: '', description: '', icon: '', color: '' });

    // Site Settings State
    const [editingSiteSettings, setEditingSiteSettings] = useState<Partial<SiteSettings>>({});
    const [showSettingsForm, setShowSettingsForm] = useState(false);
    const [linkInput, setLinkInput] = useState({ label: '', url: '', category: 'company' as 'divisions' | 'company' | 'other' });
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [projs, leadsData, posts, packages, faqsData, teamData, testimonialsData, homeContent, settings] = await Promise.all([
                mockDataService.getProjects(),
                mockDataService.getLeads(),
                mockDataService.getBlogPosts(),
                mockDataService.getPricingPackages(),
                mockDataService.getFAQs(),
                apiService.teamMembers.getAll(),
                apiService.testimonials.getAll(),
                apiService.homePageContent.get(),
                apiService.siteSettings.get()
            ]);
            setProjects(projs);
            setLeads(leadsData);
            setBlogPosts(posts);
            setPricingPackages(packages);
            setFaqs(faqsData);
            setTeamMembers(teamData);
            setTestimonials(testimonialsData);
            setHomePageContent(homeContent);
            setSiteSettings(settings);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    // Project handlers
    const handleAddTag = () => {
        if (tagInput && newProject.tags) {
            setNewProject({...newProject, tags: [...newProject.tags, tagInput]});
            setTagInput('');
        }
    };

    const handleGenerateDescription = async () => {
        if (!newProject.title || !newProject.division) return;
        setIsGenerating(true);
        try {
            const desc = await generateProjectDescription(
                newProject.title, 
                newProject.division, 
                newProject.tags || []
            );
            setNewProject(prev => ({ ...prev, description: desc }));
        } catch (error) {
            console.error('Error generating description:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveProject = async () => {
        try {
            const project = await mockDataService.createProject({
                title: newProject.title || 'Sans Titre',
                client: newProject.client || 'Inconnu',
                division: newProject.division as Division,
                tags: newProject.tags || [],
                imageUrl: newProject.imageUrl || '',
                description: newProject.description || ''
            });
            setProjects([...projects, project]);
            setNewProject({
                title: '',
                client: '',
                division: Division.TECH,
                tags: [],
                description: '',
                imageUrl: 'https://picsum.photos/seed/new/600/400'
            });
            setShowProjectForm(false);
        } catch (error) {
            console.error('Error saving project:', error);
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            try {
                await mockDataService.deleteProject(id);
                setProjects(projects.filter(p => p.id !== id));
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    // Lead handlers
    const handleUpdateLeadStatus = async (id: string, status: Lead['status']) => {
        try {
            await mockDataService.updateLeadStatus(id, status);
            setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
        } catch (error) {
            console.error('Error updating lead:', error);
        }
    };

    const handleDeleteLead = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
            try {
                await mockDataService.deleteLead(id);
                setLeads(leads.filter(l => l.id !== id));
            } catch (error) {
                console.error('Error deleting lead:', error);
            }
        }
    };

    // Blog Post handlers
    const handleSaveBlogPost = async () => {
        try {
            const slug = newBlogPost.slug || newBlogPost.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';
            const post = await mockDataService.createBlogPost({
                title: newBlogPost.title || '',
                excerpt: newBlogPost.excerpt || '',
                category: newBlogPost.category || '',
                date: newBlogPost.date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
                imageUrl: newBlogPost.imageUrl || '',
                slug: slug
            });
            setBlogPosts([...blogPosts, post]);
            setNewBlogPost({
                title: '',
                excerpt: '',
                category: '',
                date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
                imageUrl: 'https://picsum.photos/seed/blog/800/600',
                slug: ''
            });
            setShowBlogForm(false);
        } catch (error) {
            console.error('Error saving blog post:', error);
        }
    };

    const handleDeleteBlogPost = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            try {
                await mockDataService.deleteBlogPost(id);
                setBlogPosts(blogPosts.filter(p => p.id !== id));
            } catch (error) {
                console.error('Error deleting blog post:', error);
            }
        }
    };

    // Pricing Package handlers
    const handleAddFeature = () => {
        if (featureInput && newPricingPackage.features) {
            setNewPricingPackage({...newPricingPackage, features: [...newPricingPackage.features, featureInput]});
            setFeatureInput('');
        }
    };

    const handleSavePricingPackage = async () => {
        try {
            const pkg = await mockDataService.createPricingPackage({
                title: newPricingPackage.title || '',
                division: newPricingPackage.division || 'TECH',
                price: newPricingPackage.price || '',
                priceNote: newPricingPackage.priceNote,
                features: newPricingPackage.features || [],
                highlight: newPricingPackage.highlight,
                popular: newPricingPackage.popular,
                description: newPricingPackage.description,
                deliveryTime: newPricingPackage.deliveryTime,
                revisions: newPricingPackage.revisions
            });
            setPricingPackages([...pricingPackages, pkg]);
            setNewPricingPackage({
                title: '',
                division: 'TECH',
                price: '',
                features: [],
                description: ''
            });
            setShowPricingForm(false);
        } catch (error) {
            console.error('Error saving pricing package:', error);
        }
    };

    const handleDeletePricingPackage = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce package ?')) {
            try {
                await mockDataService.deletePricingPackage(id);
                setPricingPackages(pricingPackages.filter(p => p.id !== id));
            } catch (error) {
                console.error('Error deleting pricing package:', error);
            }
        }
    };

    // FAQ handlers
    const handleSaveFAQ = async () => {
        try {
            const faq = await mockDataService.createFAQ({
                question: newFAQ.question || '',
                answer: newFAQ.answer || ''
            });
            setFaqs([...faqs, faq]);
            setNewFAQ({ question: '', answer: '' });
            setShowFAQForm(false);
        } catch (error) {
            console.error('Error saving FAQ:', error);
        }
    };

    const handleDeleteFAQ = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette FAQ ?')) {
            try {
                await mockDataService.deleteFAQ(id);
                setFaqs(faqs.filter(f => f.id !== id));
            } catch (error) {
                console.error('Error deleting FAQ:', error);
            }
        }
    };

    // Team Member handlers
    const handleAddExpertise = () => {
        if (expertiseInput && newTeamMember.expertise) {
            setNewTeamMember({...newTeamMember, expertise: [...newTeamMember.expertise, expertiseInput]});
            setExpertiseInput('');
        }
    };

    const handleSaveTeamMember = async () => {
        try {
            const member = await apiService.teamMembers.create({
                name: newTeamMember.name || '',
                role: newTeamMember.role || '',
                division: newTeamMember.division || Division.TECH,
                bio: newTeamMember.bio || '',
                photo: newTeamMember.photo || 'https://i.pravatar.cc/300',
                expertise: newTeamMember.expertise || [],
                featured: newTeamMember.featured || false,
                linkedin: newTeamMember.linkedin,
                email: newTeamMember.email
            });
            setTeamMembers([...teamMembers, member]);
            setNewTeamMember({
                name: '',
                role: '',
                division: Division.TECH,
                bio: '',
                photo: 'https://i.pravatar.cc/300',
                expertise: [],
                featured: false
            });
            setShowTeamForm(false);
        } catch (error) {
            console.error('Error saving team member:', error);
        }
    };

    const handleDeleteTeamMember = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
            try {
                await apiService.teamMembers.delete(id);
                setTeamMembers(teamMembers.filter(m => m.id !== id));
            } catch (error) {
                console.error('Error deleting team member:', error);
            }
        }
    };

    // Testimonial handlers
    const handleSaveTestimonial = async () => {
        try {
            const testimonial = await apiService.testimonials.create({
                name: newTestimonial.name || '',
                role: newTestimonial.role || '',
                company: newTestimonial.company || '',
                content: newTestimonial.content || '',
                rating: newTestimonial.rating || 5,
                division: newTestimonial.division,
                photo: newTestimonial.photo,
                companyLogo: newTestimonial.companyLogo,
                videoUrl: newTestimonial.videoUrl
            });
            setTestimonials([...testimonials, testimonial]);
            setNewTestimonial({
                name: '',
                role: '',
                company: '',
                content: '',
                rating: 5,
                division: Division.TECH
            });
            setShowTestimonialForm(false);
        } catch (error) {
            console.error('Error saving testimonial:', error);
        }
    };

    const handleDeleteTestimonial = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce témoignage ?')) {
            try {
                await apiService.testimonials.delete(id);
                setTestimonials(testimonials.filter(t => t.id !== id));
            } catch (error) {
                console.error('Error deleting testimonial:', error);
            }
        }
    };

    // Home Page Content handlers
    const handleSaveHomeContent = async () => {
        if (!homePageContent) return;
        try {
            const updated = await apiService.homePageContent.update(editingHomeContent);
            setHomePageContent(updated);
            setEditingHomeContent({});
            setShowHomeForm(false);
        } catch (error) {
            console.error('Error saving home content:', error);
        }
    };

    const handleAddMetric = () => {
        if (!homePageContent || !metricInput.value || !metricInput.label) return;
        const newMetric = {
            id: Date.now().toString(),
            value: metricInput.value,
            label: metricInput.label,
            icon: metricInput.icon,
            color: metricInput.color,
            order: (homePageContent.metrics?.length || 0) + 1
        };
        setEditingHomeContent({
            ...editingHomeContent,
            metrics: [...(homePageContent.metrics || []), newMetric]
        });
        setMetricInput({ value: '', label: '', icon: '', color: '' });
    };

    const handleAddStep = () => {
        if (!homePageContent || !stepInput.step || !stepInput.title) return;
        const newStep = {
            id: Date.now().toString(),
            step: stepInput.step,
            title: stepInput.title,
            description: stepInput.description,
            icon: stepInput.icon,
            order: (homePageContent.methodologySteps?.length || 0) + 1
        };
        setEditingHomeContent({
            ...editingHomeContent,
            methodologySteps: [...(homePageContent.methodologySteps || []), newStep]
        });
        setStepInput({ step: '', title: '', description: '', icon: '' });
    };

    const handleAddWhyUsItem = () => {
        if (!homePageContent || !whyUsInput.title) return;
        const newItem = {
            id: Date.now().toString(),
            title: whyUsInput.title,
            description: whyUsInput.description,
            icon: whyUsInput.icon,
            color: whyUsInput.color
        };
        setEditingHomeContent({
            ...editingHomeContent,
            whyUsItems: [...(homePageContent.whyUsItems || []), newItem]
        });
        setWhyUsInput({ title: '', description: '', icon: '', color: '' });
    };

    // Site Settings handlers
    const handleSaveSiteSettings = async () => {
        if (!siteSettings) return;
        try {
            const updated = await apiService.siteSettings.update(editingSiteSettings);
            setSiteSettings(updated);
            setEditingSiteSettings({});
            setShowSettingsForm(false);
        } catch (error) {
            console.error('Error saving site settings:', error);
        }
    };

    const handleAddFooterLink = () => {
        if (!siteSettings || !linkInput.label || !linkInput.url) return;
        const newLink = {
            id: Date.now().toString(),
            label: linkInput.label,
            url: linkInput.url,
            category: linkInput.category
        };
        setEditingSiteSettings({
            ...editingSiteSettings,
            footerLinks: [...(siteSettings.footerLinks || []), newLink]
        });
        setLinkInput({ label: '', url: '', category: 'company' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center bg-[#020205] min-h-screen">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex bg-[#020205] min-h-screen">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden top-4 left-4 z-50 fixed bg-[#0a0a16] p-2 border border-white/10 rounded-lg text-white"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <aside className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-[#050510] transition-transform duration-300`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-gray-500 text-xs uppercase tracking-wider">Gestion</h2>
                        <button
                            onClick={handleLogout}
                            className="hover:bg-white/5 p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                            title="Déconnexion"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                    <nav className="space-y-2">
                        {[
                            { id: 'projects' as TabType, label: 'Projets', icon: LayoutDashboard },
                            { id: 'leads' as TabType, label: 'Demandes', icon: Users },
                            { id: 'blog' as TabType, label: 'Blog', icon: BookOpen },
                            { id: 'pricing' as TabType, label: 'Tarifs', icon: DollarSign },
                            { id: 'faq' as TabType, label: 'FAQ', icon: HelpCircle },
                            { id: 'team' as TabType, label: 'Équipe', icon: UserCircle },
                            { id: 'testimonials' as TabType, label: 'Témoignages', icon: MessageSquare },
                            { id: 'home' as TabType, label: 'Page d\'accueil', icon: Home },
                            { id: 'settings' as TabType, label: 'Paramètres', icon: Settings },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === tab.id ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden z-30 fixed inset-0 bg-black/50"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-y-auto">
                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div className="mx-auto max-w-4xl">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="font-bold text-white text-2xl">Gestion de Projets</h1>
                            <button
                                onClick={() => setShowProjectForm(!showProjectForm)}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>{showProjectForm ? 'Annuler' : 'Nouveau Projet'}</span>
                            </button>
                        </div>

                        {showProjectForm && (
                            <div className="bg-[#0a0a16] mb-8 p-6 border border-white/10 rounded-xl">
                                <h3 className="flex items-center mb-6 font-medium text-white text-lg">
                                    <Plus className="mr-2 w-5 h-5 text-blue-500" />
                                    Ajouter un Nouveau Projet
                                </h3>
                                <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-6">
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Titre</label>
                                        <input
                                            type="text"
                                            value={newProject.title}
                                            onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Client</label>
                                        <input
                                            type="text"
                                            value={newProject.client}
                                            onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Division</label>
                                    <div className="flex space-x-4">
                                        {Object.values(Division).map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setNewProject({...newProject, division: d})}
                                                className={`px-4 py-2 rounded border text-sm transition-all ${
                                                    newProject.division === d 
                                                        ? DIVISION_CONFIG[d].border + ' ' + DIVISION_CONFIG[d].bg + ' ' + DIVISION_CONFIG[d].color 
                                                        : 'border-white/10 text-gray-500'
                                                }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Tags</label>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                            className="flex-1 bg-black/30 px-3 py-2 border border-white/10 rounded outline-none text-white text-sm"
                                            placeholder="Ajouter un tag..."
                                        />
                                        <button onClick={handleAddTag} className="px-3 py-2 text-blue-400 hover:text-white text-sm">Ajouter</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {newProject.tags?.map(t => (
                                            <span key={t} className="flex items-center bg-white/10 px-2 py-1 rounded text-gray-300 text-xs">
                                                {t}
                                                <button
                                                    onClick={() => setNewProject({...newProject, tags: newProject.tags?.filter(tag => tag !== t)})}
                                                    className="ml-2 text-red-400 hover:text-red-300"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Image URL</label>
                                    <input
                                        type="text"
                                        value={newProject.imageUrl}
                                        onChange={(e) => setNewProject({...newProject, imageUrl: e.target.value})}
                                        className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white text-sm"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block font-bold text-gray-500 text-xs uppercase">Description</label>
                                        <button
                                            onClick={handleGenerateDescription}
                                            disabled={isGenerating || !newProject.title}
                                            className="flex items-center disabled:opacity-50 text-fuchsia-400 hover:text-fuchsia-300 text-xs"
                                        >
                                            {isGenerating ? <Loader2 className="mr-1 w-3 h-3 animate-spin" /> : <Sparkles className="mr-1 w-3 h-3" />}
                                            Générer avec l'IA
                                        </button>
                                    </div>
                                    <textarea
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                        rows={3}
                                        className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white text-sm"
                                        placeholder="Cliquez sur 'Générer avec l'IA' pour créer automatiquement une description."
                                    />
                                </div>

                                <button
                                    onClick={handleSaveProject}
                                    className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg w-full font-bold text-white transition-colors"
                                >
                                    Publier le Projet
                                </button>
                            </div>
                        )}

                        <div className="space-y-4">
                            {projects.length === 0 ? (
                                <div className="py-8 text-gray-500 text-center">Aucun projet pour le moment.</div>
                            ) : (
                                projects.map(p => (
                                    <div key={p.id} className="flex justify-between items-center bg-white/5 p-4 border border-white/10 rounded-lg">
                                        <div>
                                            <h4 className="font-bold text-white">{p.title}</h4>
                                            <p className="text-gray-400 text-sm">{p.client}</p>
                                            <span className={`text-xs ${DIVISION_CONFIG[p.division].color}`}>{p.division}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteProject(p.id)}
                                            className="p-2 text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Leads Tab */}
                {activeTab === 'leads' && (
                    <div className="mx-auto max-w-6xl">
                        <h1 className="mb-8 font-bold text-white text-2xl">Demandes Clients</h1>
                        <div className="bg-[#0a0a16] border border-white/10 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-gray-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Nom</th>
                                        <th className="px-6 py-4">Intérêt</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {leads.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-gray-500 text-center">Aucune demande pour le moment.</td>
                                        </tr>
                                    ) : (
                                        leads.map(lead => (
                                            <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-white">{lead.name}</div>
                                                    <div className="text-gray-500 text-sm">{lead.email}</div>
                                                    {lead.message && (
                                                        <div className="mt-1 max-w-xs text-gray-400 text-xs truncate">{lead.message}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-bold ${DIVISION_CONFIG[lead.interest_division].color}`}>
                                                        {lead.interest_division}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={lead.status}
                                                        onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as Lead['status'])}
                                                        className="bg-black/30 px-2 py-1 border border-white/10 rounded text-white text-xs"
                                                    >
                                                        <option value="new">Nouveau</option>
                                                        <option value="contacted">Contacté</option>
                                                        <option value="closed">Fermé</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 text-sm">{lead.date}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleDeleteLead(lead.id)}
                                                        className="p-1 text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Blog Tab */}
                {activeTab === 'blog' && (
                    <div className="mx-auto max-w-4xl">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="font-bold text-white text-2xl">Gestion du Blog</h1>
                            <button
                                onClick={() => setShowBlogForm(!showBlogForm)}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>{showBlogForm ? 'Annuler' : 'Nouvel Article'}</span>
                            </button>
                        </div>

                        {showBlogForm && (
                            <div className="bg-[#0a0a16] mb-8 p-6 border border-white/10 rounded-xl">
                                <h3 className="mb-6 font-medium text-white text-lg">Nouvel Article</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Titre</label>
                                        <input
                                            type="text"
                                            value={newBlogPost.title}
                                            onChange={(e) => setNewBlogPost({...newBlogPost, title: e.target.value})}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Extrait</label>
                                        <textarea
                                            value={newBlogPost.excerpt}
                                            onChange={(e) => setNewBlogPost({...newBlogPost, excerpt: e.target.value})}
                                            rows={2}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                    <div className="gap-4 grid grid-cols-2">
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Catégorie</label>
                                            <input
                                                type="text"
                                                value={newBlogPost.category}
                                                onChange={(e) => setNewBlogPost({...newBlogPost, category: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Date</label>
                                            <input
                                                type="text"
                                                value={newBlogPost.date}
                                                onChange={(e) => setNewBlogPost({...newBlogPost, date: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Image URL</label>
                                        <input
                                            type="text"
                                            value={newBlogPost.imageUrl}
                                            onChange={(e) => setNewBlogPost({...newBlogPost, imageUrl: e.target.value})}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSaveBlogPost}
                                        className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg w-full font-bold text-white transition-colors"
                                    >
                                        Publier l'Article
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {blogPosts.length === 0 ? (
                                <div className="py-8 text-gray-500 text-center">Aucun article pour le moment.</div>
                            ) : (
                                blogPosts.map(post => (
                                    <div key={post.id} className="flex justify-between items-center bg-white/5 p-4 border border-white/10 rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-white">{post.title}</h4>
                                            <p className="mt-1 text-gray-400 text-sm">{post.excerpt}</p>
                                            <div className="flex items-center space-x-3 mt-2">
                                                <span className="text-gray-500 text-xs">{post.category}</span>
                                                <span className="text-gray-500 text-xs">•</span>
                                                <span className="text-gray-500 text-xs">{post.date}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteBlogPost(post.id)}
                                            className="ml-4 p-2 text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                    <div className="mx-auto max-w-4xl">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="font-bold text-white text-2xl">Gestion des Tarifs</h1>
                            <button
                                onClick={() => setShowPricingForm(!showPricingForm)}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>{showPricingForm ? 'Annuler' : 'Nouveau Package'}</span>
                            </button>
                        </div>

                        {showPricingForm && (
                            <div className="bg-[#0a0a16] mb-8 p-6 border border-white/10 rounded-xl">
                                <h3 className="mb-6 font-medium text-white text-lg">Nouveau Package</h3>
                                <div className="space-y-4">
                                    <div className="gap-4 grid grid-cols-2">
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Titre</label>
                                            <input
                                                type="text"
                                                value={newPricingPackage.title}
                                                onChange={(e) => setNewPricingPackage({...newPricingPackage, title: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Division</label>
                                            <select
                                                value={newPricingPackage.division}
                                                onChange={(e) => setNewPricingPackage({...newPricingPackage, division: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            >
                                                <option value="TECH">TECH</option>
                                                <option value="STUDIO">STUDIO</option>
                                                <option value="BRAND">BRAND</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="gap-4 grid grid-cols-2">
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Prix</label>
                                            <input
                                                type="text"
                                                value={newPricingPackage.price}
                                                onChange={(e) => setNewPricingPackage({...newPricingPackage, price: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                                placeholder="2,500€"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Note de Prix</label>
                                            <input
                                                type="text"
                                                value={newPricingPackage.priceNote}
                                                onChange={(e) => setNewPricingPackage({...newPricingPackage, priceNote: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                                placeholder="Paiement unique"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Description</label>
                                        <textarea
                                            value={newPricingPackage.description}
                                            onChange={(e) => setNewPricingPackage({...newPricingPackage, description: e.target.value})}
                                            rows={2}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Fonctionnalités</label>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <input
                                                type="text"
                                                value={featureInput}
                                                onChange={(e) => setFeatureInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                                                className="flex-1 bg-black/30 px-3 py-2 border border-white/10 rounded outline-none text-white text-sm"
                                                placeholder="Ajouter une fonctionnalité..."
                                            />
                                            <button onClick={handleAddFeature} className="px-3 py-2 text-blue-400 hover:text-white text-sm">Ajouter</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {newPricingPackage.features?.map((f, idx) => (
                                                <span key={idx} className="flex items-center bg-white/10 px-2 py-1 rounded text-gray-300 text-xs">
                                                    {f}
                                                    <button
                                                        onClick={() => setNewPricingPackage({...newPricingPackage, features: newPricingPackage.features?.filter((_, i) => i !== idx)})}
                                                        className="ml-2 text-red-400 hover:text-red-300"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center space-x-2 text-gray-400 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={newPricingPackage.popular || false}
                                                onChange={(e) => setNewPricingPackage({...newPricingPackage, popular: e.target.checked})}
                                                className="rounded"
                                            />
                                            <span>Populaire</span>
                                        </label>
                                        <label className="flex items-center space-x-2 text-gray-400 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={newPricingPackage.highlight || false}
                                                onChange={(e) => setNewPricingPackage({...newPricingPackage, highlight: e.target.checked})}
                                                className="rounded"
                                            />
                                            <span>Mettre en avant</span>
                                        </label>
                                    </div>
                                    <button
                                        onClick={handleSavePricingPackage}
                                        className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg w-full font-bold text-white transition-colors"
                                    >
                                        Créer le Package
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {pricingPackages.length === 0 ? (
                                <div className="py-8 text-gray-500 text-center">Aucun package pour le moment.</div>
                            ) : (
                                pricingPackages.map(pkg => (
                                    <div key={pkg.id} className="flex justify-between items-center bg-white/5 p-4 border border-white/10 rounded-lg">
                                        <div>
                                            <h4 className="font-bold text-white">{pkg.title}</h4>
                                            <p className="text-gray-400 text-sm">{pkg.division} • {pkg.price}</p>
                                            {pkg.popular && <span className="text-yellow-400 text-xs">⭐ Populaire</span>}
                                        </div>
                                        <button
                                            onClick={() => handleDeletePricingPackage(pkg.id)}
                                            className="p-2 text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                    <div className="mx-auto max-w-4xl">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="font-bold text-white text-2xl">Gestion des FAQ</h1>
                            <button
                                onClick={() => setShowFAQForm(!showFAQForm)}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>{showFAQForm ? 'Annuler' : 'Nouvelle FAQ'}</span>
                            </button>
                        </div>

                        {showFAQForm && (
                            <div className="bg-[#0a0a16] mb-8 p-6 border border-white/10 rounded-xl">
                                <h3 className="mb-6 font-medium text-white text-lg">Nouvelle FAQ</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Question</label>
                                        <input
                                            type="text"
                                            value={newFAQ.question}
                                            onChange={(e) => setNewFAQ({...newFAQ, question: e.target.value})}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Réponse</label>
                                        <textarea
                                            value={newFAQ.answer}
                                            onChange={(e) => setNewFAQ({...newFAQ, answer: e.target.value})}
                                            rows={4}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSaveFAQ}
                                        className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg w-full font-bold text-white transition-colors"
                                    >
                                        Ajouter la FAQ
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {faqs.length === 0 ? (
                                <div className="py-8 text-gray-500 text-center">Aucune FAQ pour le moment.</div>
                            ) : (
                                faqs.map(faq => (
                                    <div key={faq.id} className="bg-white/5 p-4 border border-white/10 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="mb-2 font-bold text-white">{faq.question}</h4>
                                                <p className="text-gray-400 text-sm">{faq.answer}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteFAQ(faq.id)}
                                                className="ml-4 p-2 text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Team Tab */}
                {activeTab === 'team' && (
                    <div className="mx-auto max-w-4xl">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="font-bold text-white text-2xl">Gestion de l'Équipe</h1>
                            <button
                                onClick={() => setShowTeamForm(!showTeamForm)}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>{showTeamForm ? 'Annuler' : 'Nouveau Membre'}</span>
                            </button>
                        </div>

                        {showTeamForm && (
                            <div className="bg-[#0a0a16] mb-8 p-6 border border-white/10 rounded-xl">
                                <h3 className="mb-6 font-medium text-white text-lg">Nouveau Membre</h3>
                                <div className="space-y-4">
                                    <div className="gap-4 grid grid-cols-2">
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Nom</label>
                                            <input
                                                type="text"
                                                value={newTeamMember.name}
                                                onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Rôle</label>
                                            <input
                                                type="text"
                                                value={newTeamMember.role}
                                                onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Division</label>
                                        <select
                                            value={newTeamMember.division}
                                            onChange={(e) => setNewTeamMember({...newTeamMember, division: e.target.value as Division})}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        >
                                            {Object.values(Division).map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Photo URL</label>
                                        <input
                                            type="text"
                                            value={newTeamMember.photo}
                                            onChange={(e) => setNewTeamMember({...newTeamMember, photo: e.target.value})}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Bio</label>
                                        <textarea
                                            value={newTeamMember.bio}
                                            onChange={(e) => setNewTeamMember({...newTeamMember, bio: e.target.value})}
                                            rows={3}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Expertise</label>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <input
                                                type="text"
                                                value={expertiseInput}
                                                onChange={(e) => setExpertiseInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddExpertise()}
                                                className="flex-1 bg-black/30 px-3 py-2 border border-white/10 rounded outline-none text-white text-sm"
                                                placeholder="Ajouter une compétence..."
                                            />
                                            <button onClick={handleAddExpertise} className="px-3 py-2 text-blue-400 hover:text-white text-sm">Ajouter</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {newTeamMember.expertise?.map((exp, idx) => (
                                                <span key={idx} className="flex items-center bg-white/10 px-2 py-1 rounded text-gray-300 text-xs">
                                                    {exp}
                                                    <button
                                                        onClick={() => setNewTeamMember({...newTeamMember, expertise: newTeamMember.expertise?.filter((_, i) => i !== idx)})}
                                                        className="ml-2 text-red-400 hover:text-red-300"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center space-x-2 text-gray-400 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={newTeamMember.featured || false}
                                                onChange={(e) => setNewTeamMember({...newTeamMember, featured: e.target.checked})}
                                                className="rounded"
                                            />
                                            <span>Membre vedette</span>
                                        </label>
                                    </div>
                                    <button
                                        onClick={handleSaveTeamMember}
                                        className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg w-full font-bold text-white transition-colors"
                                    >
                                        Ajouter le Membre
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {teamMembers.length === 0 ? (
                                <div className="py-8 text-gray-500 text-center">Aucun membre pour le moment.</div>
                            ) : (
                                teamMembers.map(member => (
                                    <div key={member.id} className="flex justify-between items-center bg-white/5 p-4 border border-white/10 rounded-lg">
                                        <div>
                                            <h4 className="font-bold text-white">{member.name}</h4>
                                            <p className="text-gray-400 text-sm">{member.role}</p>
                                            <span className={`text-xs ${DIVISION_CONFIG[member.division].color}`}>{member.division}</span>
                                            {member.featured && <span className="ml-2 text-yellow-400 text-xs">⭐ Vedette</span>}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteTeamMember(member.id)}
                                            className="p-2 text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Testimonials Tab */}
                {activeTab === 'testimonials' && (
                    <div className="mx-auto max-w-4xl">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="font-bold text-white text-2xl">Gestion des Témoignages</h1>
                            <button
                                onClick={() => setShowTestimonialForm(!showTestimonialForm)}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>{showTestimonialForm ? 'Annuler' : 'Nouveau Témoignage'}</span>
                            </button>
                        </div>

                        {showTestimonialForm && (
                            <div className="bg-[#0a0a16] mb-8 p-6 border border-white/10 rounded-xl">
                                <h3 className="mb-6 font-medium text-white text-lg">Nouveau Témoignage</h3>
                                <div className="space-y-4">
                                    <div className="gap-4 grid grid-cols-2">
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Nom</label>
                                            <input
                                                type="text"
                                                value={newTestimonial.name}
                                                onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Rôle</label>
                                            <input
                                                type="text"
                                                value={newTestimonial.role}
                                                onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Entreprise</label>
                                        <input
                                            type="text"
                                            value={newTestimonial.company}
                                            onChange={(e) => setNewTestimonial({...newTestimonial, company: e.target.value})}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Témoignage</label>
                                        <textarea
                                            value={newTestimonial.content}
                                            onChange={(e) => setNewTestimonial({...newTestimonial, content: e.target.value})}
                                            rows={4}
                                            className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                        />
                                    </div>
                                    <div className="gap-4 grid grid-cols-2">
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Note (1-5)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="5"
                                                value={newTestimonial.rating}
                                                onChange={(e) => setNewTestimonial({...newTestimonial, rating: parseInt(e.target.value)})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Division</label>
                                            <select
                                                value={newTestimonial.division}
                                                onChange={(e) => setNewTestimonial({...newTestimonial, division: e.target.value as Division})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            >
                                                <option value="">Toutes</option>
                                                {Object.values(Division).map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSaveTestimonial}
                                        className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg w-full font-bold text-white transition-colors"
                                    >
                                        Ajouter le Témoignage
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {testimonials.length === 0 ? (
                                <div className="py-8 text-gray-500 text-center">Aucun témoignage pour le moment.</div>
                            ) : (
                                testimonials.map(testimonial => (
                                    <div key={testimonial.id} className="bg-white/5 p-4 border border-white/10 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                                                    <div className="flex items-center space-x-1">
                                                        {[...Array(testimonial.rating)].map((_, i) => (
                                                            <Star key={i} className="fill-yellow-400 w-4 h-4 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-1">{testimonial.role}, {testimonial.company}</p>
                                                <p className="text-gray-300 text-sm">{testimonial.content}</p>
                                                {testimonial.division && (
                                                    <span className={`text-xs ${DIVISION_CONFIG[testimonial.division].color}`}>
                                                        {testimonial.division}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteTestimonial(testimonial.id)}
                                                className="ml-4 p-2 text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Home Page Content Tab */}
                {activeTab === 'home' && homePageContent && (
                    <div className="mx-auto max-w-6xl">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="font-bold text-white text-2xl">Contenu de la Page d'Accueil</h1>
                            <button
                                onClick={() => {
                                    setEditingHomeContent({...homePageContent});
                                    setShowHomeForm(!showHomeForm);
                                }}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>{showHomeForm ? 'Annuler' : 'Modifier'}</span>
                            </button>
                        </div>

                        {showHomeForm && (
                            <div className="bg-[#0a0a16] mb-8 p-6 border border-white/10 rounded-xl space-y-6">
                                {/* Hero Section */}
                                <div>
                                    <h3 className="mb-4 font-medium text-white text-lg">Section Hero</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Badge</label>
                                            <input
                                                type="text"
                                                value={editingHomeContent.heroBadge || ''}
                                                onChange={(e) => setEditingHomeContent({...editingHomeContent, heroBadge: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Titre Principal</label>
                                            <input
                                                type="text"
                                                value={editingHomeContent.heroTitle || ''}
                                                onChange={(e) => setEditingHomeContent({...editingHomeContent, heroTitle: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Sous-titre</label>
                                            <input
                                                type="text"
                                                value={editingHomeContent.heroSubtitle || ''}
                                                onChange={(e) => setEditingHomeContent({...editingHomeContent, heroSubtitle: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Description</label>
                                            <textarea
                                                value={editingHomeContent.heroDescription || ''}
                                                onChange={(e) => setEditingHomeContent({...editingHomeContent, heroDescription: e.target.value})}
                                                rows={2}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Metrics Section */}
                                <div>
                                    <h3 className="mb-4 font-medium text-white text-lg">Métriques</h3>
                                    <div className="space-y-4">
                                        <div className="gap-4 grid grid-cols-4">
                                            <input
                                                type="text"
                                                value={metricInput.value}
                                                onChange={(e) => setMetricInput({...metricInput, value: e.target.value})}
                                                placeholder="Valeur"
                                                className="bg-black/30 px-3 py-2 border border-white/10 rounded outline-none text-white text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={metricInput.label}
                                                onChange={(e) => setMetricInput({...metricInput, label: e.target.value})}
                                                placeholder="Label"
                                                className="bg-black/30 px-3 py-2 border border-white/10 rounded outline-none text-white text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={metricInput.icon}
                                                onChange={(e) => setMetricInput({...metricInput, icon: e.target.value})}
                                                placeholder="Icône"
                                                className="bg-black/30 px-3 py-2 border border-white/10 rounded outline-none text-white text-sm"
                                            />
                                            <button onClick={handleAddMetric} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm">Ajouter</button>
                                        </div>
                                        <div className="space-y-2">
                                            {editingHomeContent.metrics?.map((metric, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-white/5 p-2 rounded">
                                                    <span className="text-gray-300 text-sm">{metric.value} - {metric.label}</span>
                                                    <button
                                                        onClick={() => setEditingHomeContent({
                                                            ...editingHomeContent,
                                                            metrics: editingHomeContent.metrics?.filter((_, i) => i !== idx)
                                                        })}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Tech Stacks */}
                                <div>
                                    <h3 className="mb-4 font-medium text-white text-lg">Stacks Technologiques</h3>
                                    <div className="gap-4 grid grid-cols-2">
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Stack Tech (séparé par virgule)</label>
                                            <textarea
                                                value={editingHomeContent.techStackItems?.join(', ') || ''}
                                                onChange={(e) => setEditingHomeContent({
                                                    ...editingHomeContent,
                                                    techStackItems: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                                })}
                                                rows={3}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Stack Créatif (séparé par virgule)</label>
                                            <textarea
                                                value={editingHomeContent.creativeStackItems?.join(', ') || ''}
                                                onChange={(e) => setEditingHomeContent({
                                                    ...editingHomeContent,
                                                    creativeStackItems: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                                })}
                                                rows={3}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveHomeContent}
                                    className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg w-full font-bold text-white transition-colors"
                                >
                                    Enregistrer les Modifications
                                </button>
                            </div>
                        )}

                        {/* Preview */}
                        {!showHomeForm && (
                            <div className="space-y-4 text-gray-400 text-sm">
                                <p><strong className="text-white">Hero Title:</strong> {homePageContent.heroTitle}</p>
                                <p><strong className="text-white">Hero Subtitle:</strong> {homePageContent.heroSubtitle}</p>
                                <p><strong className="text-white">Métriques:</strong> {homePageContent.metrics?.length || 0}</p>
                                <p><strong className="text-white">Étapes Méthodologie:</strong> {homePageContent.methodologySteps?.length || 0}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Site Settings Tab */}
                {activeTab === 'settings' && siteSettings && (
                    <div className="mx-auto max-w-4xl">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="font-bold text-white text-2xl">Paramètres du Site</h1>
                            <button
                                onClick={() => {
                                    setEditingSiteSettings({...siteSettings});
                                    setShowSettingsForm(!showSettingsForm);
                                }}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>{showSettingsForm ? 'Annuler' : 'Modifier'}</span>
                            </button>
                        </div>

                        {showSettingsForm && (
                            <div className="bg-[#0a0a16] mb-8 p-6 border border-white/10 rounded-xl space-y-6">
                                <div>
                                    <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Description du Footer</label>
                                    <textarea
                                        value={editingSiteSettings.footerDescription || ''}
                                        onChange={(e) => setEditingSiteSettings({...editingSiteSettings, footerDescription: e.target.value})}
                                        rows={3}
                                        className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                    />
                                </div>
                                <div>
                                    <h3 className="mb-4 font-medium text-white text-lg">Liens Réseaux Sociaux</h3>
                                    <div className="gap-4 grid grid-cols-2">
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Twitter</label>
                                            <input
                                                type="text"
                                                value={editingSiteSettings.socialLinks?.twitter || ''}
                                                onChange={(e) => setEditingSiteSettings({
                                                    ...editingSiteSettings,
                                                    socialLinks: {...editingSiteSettings.socialLinks, twitter: e.target.value}
                                                })}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">LinkedIn</label>
                                            <input
                                                type="text"
                                                value={editingSiteSettings.socialLinks?.linkedin || ''}
                                                onChange={(e) => setEditingSiteSettings({
                                                    ...editingSiteSettings,
                                                    socialLinks: {...editingSiteSettings.socialLinks, linkedin: e.target.value}
                                                })}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">GitHub</label>
                                            <input
                                                type="text"
                                                value={editingSiteSettings.socialLinks?.github || ''}
                                                onChange={(e) => setEditingSiteSettings({
                                                    ...editingSiteSettings,
                                                    socialLinks: {...editingSiteSettings.socialLinks, github: e.target.value}
                                                })}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-bold text-gray-500 text-xs uppercase">Email Contact</label>
                                            <input
                                                type="email"
                                                value={editingSiteSettings.contactEmail || ''}
                                                onChange={(e) => setEditingSiteSettings({...editingSiteSettings, contactEmail: e.target.value})}
                                                className="bg-black/30 px-3 py-2 border border-white/10 focus:border-blue-500 rounded outline-none w-full text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveSiteSettings}
                                    className="bg-blue-600 hover:bg-blue-700 py-3 rounded-lg w-full font-bold text-white transition-colors"
                                >
                                    Enregistrer les Paramètres
                                </button>
                            </div>
                        )}

                        {!showSettingsForm && (
                            <div className="space-y-4 text-gray-400 text-sm">
                                <p><strong className="text-white">Site:</strong> {siteSettings.siteName}</p>
                                <p><strong className="text-white">Email Contact:</strong> {siteSettings.contactEmail}</p>
                                <p><strong className="text-white">Liens Footer:</strong> {siteSettings.footerLinks?.length || 0}</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
