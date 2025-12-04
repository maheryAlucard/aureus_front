import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Division, DIVISION_CONFIG, Project, Lead, BlogPost } from '../types';
import { LayoutDashboard, FileText, Users, Plus, Sparkles, Loader2, Trash2, BookOpen, DollarSign, HelpCircle, LogOut, Edit2, X, Check, Menu } from 'lucide-react';
import { generateProjectDescription } from '../services/geminiService';
import { mockDataService, PricingPackage, FAQItem } from '../services/mockDataService';
import { authService } from '../services/authService';

type TabType = 'projects' | 'leads' | 'blog' | 'pricing' | 'faq';

export const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('projects');
    const [projects, setProjects] = useState<Project[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>([]);
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [projs, leadsData, posts, packages, faqsData] = await Promise.all([
                mockDataService.getProjects(),
                mockDataService.getLeads(),
                mockDataService.getBlogPosts(),
                mockDataService.getPricingPackages(),
                mockDataService.getFAQs()
            ]);
            setProjects(projs);
            setLeads(leadsData);
            setBlogPosts(posts);
            setPricingPackages(packages);
            setFaqs(faqsData);
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
            </main>
        </div>
    );
};
