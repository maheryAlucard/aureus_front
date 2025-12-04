import React, { useState } from 'react';
import { Division, DIVISION_CONFIG, Project, Lead } from '../types';
import { LayoutDashboard, FileText, Users, Plus, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { generateProjectDescription } from '../services/geminiService';

const MockLeads: Lead[] = [
    { id: '1', name: 'Alice Smith', email: 'alice@test.com', message: 'Besoin d\'une application.', interest_division: Division.TECH, status: 'new', date: '2023-10-01' },
    { id: '2', name: 'Bob Jones', email: 'bob@test.com', message: 'Tournage commercial.', interest_division: Division.STUDIO, status: 'contacted', date: '2023-10-02' },
];

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'projects' | 'leads'>('projects');
    const [projects, setProjects] = useState<Project[]>([]); // Start empty for demo, normally fetch
    
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

    const handleAddTag = () => {
        if (tagInput && newProject.tags) {
            setNewProject({...newProject, tags: [...newProject.tags, tagInput]});
            setTagInput('');
        }
    };

    const handleGenerateDescription = async () => {
        if (!newProject.title || !newProject.division) return;
        setIsGenerating(true);
        const desc = await generateProjectDescription(
            newProject.title, 
            newProject.division, 
            newProject.tags || []
        );
        setNewProject(prev => ({ ...prev, description: desc }));
        setIsGenerating(false);
    };

    const handleSaveProject = () => {
        const project: Project = {
            id: Math.random().toString(36).substr(2, 9),
            title: newProject.title || 'Sans Titre',
            client: newProject.client || 'Inconnu',
            division: newProject.division as Division,
            tags: newProject.tags || [],
            imageUrl: newProject.imageUrl || '',
            description: newProject.description || ''
        };
        setProjects([...projects, project]);
        // Reset form
        setNewProject({
             title: '',
             client: '',
             division: Division.TECH,
             tags: [],
             description: '',
             imageUrl: 'https://picsum.photos/seed/new/600/400'
        });
    };

    return (
        <div className="flex min-h-screen pt-20 bg-[#020205]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-[#050510] hidden md:block">
                <div className="p-6">
                    <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Gestion</h2>
                    <nav className="space-y-2">
                        <button 
                            onClick={() => setActiveTab('projects')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'projects' ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span>Projets</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('leads')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'leads' ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Users className="w-5 h-5" />
                            <span>Demandes</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'projects' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-white">Gestion de Projets</h1>
                        </div>

                        {/* Add Project Form */}
                        <div className="bg-[#0a0a16] border border-white/10 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-medium text-white mb-6 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-blue-500" />
                                Ajouter un Nouveau Projet
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Titre</label>
                                    <input 
                                        type="text" 
                                        value={newProject.title}
                                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Client</label>
                                    <input 
                                        type="text" 
                                        value={newProject.client}
                                        onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Division</label>
                                <div className="flex space-x-4">
                                    {Object.values(Division).map(d => (
                                        <button
                                            key={d}
                                            onClick={() => setNewProject({...newProject, division: d})}
                                            className={`px-4 py-2 rounded border text-sm transition-all ${newProject.division === d ? DIVISION_CONFIG[d].border + ' ' + DIVISION_CONFIG[d].bg + ' ' + DIVISION_CONFIG[d].color : 'border-white/10 text-gray-500'}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs text-gray-500 uppercase font-bold mb-2">Tags</label>
                                <div className="flex items-center space-x-2 mb-2">
                                    <input 
                                        type="text" 
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        className="bg-black/30 border border-white/10 rounded px-3 py-2 text-white text-sm outline-none"
                                        placeholder="Ajouter un tag..."
                                    />
                                    <button onClick={handleAddTag} className="text-blue-400 hover:text-white text-sm">Ajouter</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {newProject.tags?.map(t => (
                                        <span key={t} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{t}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs text-gray-500 uppercase font-bold">Description</label>
                                    <button 
                                        onClick={handleGenerateDescription}
                                        disabled={isGenerating || !newProject.title}
                                        className="flex items-center text-xs text-fuchsia-400 hover:text-fuchsia-300 disabled:opacity-50"
                                    >
                                        {isGenerating ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                                        Générer avec l'IA
                                    </button>
                                </div>
                                <textarea 
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                    rows={3}
                                    className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-white focus:border-blue-500 outline-none text-sm"
                                    placeholder="Cliquez sur 'Générer avec l'IA' pour créer automatiquement une description."
                                />
                            </div>

                            <button 
                                onClick={handleSaveProject}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Publier le Projet
                            </button>
                        </div>

                        {/* List */}
                        <div className="space-y-4">
                            {projects.length === 0 && <div className="text-gray-500 text-center py-8">Aucun projet créé pour le moment.</div>}
                            {projects.map(p => (
                                <div key={p.id} className="bg-white/5 border border-white/10 p-4 rounded-lg flex items-center justify-between">
                                    <div>
                                        <h4 className="text-white font-bold">{p.title}</h4>
                                        <span className={`text-xs ${DIVISION_CONFIG[p.division].color}`}>{p.division}</span>
                                    </div>
                                    <button className="text-red-400 hover:text-red-300"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'leads' && (
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold text-white mb-8">Demandes</h1>
                        <div className="bg-[#0a0a16] border border-white/10 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-xs text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Nom</th>
                                        <th className="px-6 py-4">Intérêt</th>
                                        <th className="px-6 py-4">Statut</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {MockLeads.map(lead => (
                                        <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-white font-medium">{lead.name}</div>
                                                <div className="text-gray-500 text-sm">{lead.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold ${DIVISION_CONFIG[lead.interest_division].color}`}>
                                                    {lead.interest_division}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                                                    {lead.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-blue-400 hover:text-blue-300 text-sm">Voir Détails</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};