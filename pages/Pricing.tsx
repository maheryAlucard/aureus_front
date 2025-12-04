import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Division, DIVISION_CONFIG } from '../types';
import { Check, X, ChevronDown, ChevronUp, Zap, Shield, Clock, Users, TrendingUp, Sparkles, ArrowRight, HelpCircle, Star, Award, FileText, Calendar, CreditCard, Loader2 } from 'lucide-react';
import { mockDataService, PricingPackage } from '../services/mockDataService';
import { useFAQs } from '../hooks/useFAQs';

interface PricingPackage {
    title: string;
    division: Division;
    price: string;
    priceNote?: string;
    features: string[];
    highlight?: boolean;
    popular?: boolean;
    description?: string;
    deliveryTime?: string;
    revisions?: string;
}

const TECH_PACKAGES: PricingPackage[] = [
    {
        title: "Starter Web",
        division: Division.TECH,
        price: "2,500€",
        priceNote: "Paiement unique",
        description: "Parfait pour lancer votre présence en ligne",
        deliveryTime: "3-4 semaines",
        revisions: "2 rounds",
        features: [
            "Site Vitrine Next.js (5 pages max)",
            "SEO de base (meta tags, sitemap)",
            "Hébergement configuré (1 an inclus)",
            "Design Responsive (mobile-first)",
            "Formulaire de contact",
            "Intégration Google Analytics",
            "Support technique 3 mois"
        ]
    },
    {
        title: "Business SaaS",
        division: Division.TECH,
        price: "8,500€",
        priceNote: "Paiement échelonné possible",
        description: "Pour les applications métier complètes",
        deliveryTime: "8-12 semaines",
        revisions: "Illimitées",
        popular: true,
        highlight: true,
        features: [
            "Application web full-stack",
            "Authentification & gestion utilisateurs",
            "Base de données PostgreSQL",
            "API REST sécurisée",
            "Dashboard admin complet",
            "Paiements Stripe intégrés",
            "Déploiement AWS/Vercel",
            "Documentation technique",
            "Support prioritaire 6 mois",
            "Formation équipe incluse"
        ]
    },
    {
        title: "Enterprise AI",
        division: Division.TECH,
        price: "Sur devis",
        priceNote: "À partir de 25,000€",
        description: "Solutions IA sur mesure et automations avancées",
        deliveryTime: "12-20 semaines",
        revisions: "Illimitées",
        features: [
            "Agents IA conversationnels",
            "Automatisation workflows (Make/Zapier)",
            "Intégrations API tierces",
            "Machine Learning custom",
            "Infrastructure scalable",
            "Monitoring & analytics avancés",
            "SLA 99.9% uptime",
            "Support dédié 24/7",
            "Formation & documentation complète",
            "Maintenance & évolution continue"
        ]
    }
];

const STUDIO_PACKAGES: PricingPackage[] = [
    {
        title: "Pack Créateur",
        division: Division.STUDIO,
        price: "1,200€",
        priceNote: "Par jour de tournage",
        description: "Production vidéo événementielle",
        deliveryTime: "1-2 semaines post-tournage",
        revisions: "2 rounds",
        features: [
            "Tournage 4K (caméraman + matériel)",
            "Étalonnage cinéma (DaVinci Resolve)",
            "Montage réseaux sociaux (3 formats)",
            "Drone inclus (si autorisé)",
            "Audio professionnel (micro-cravate)",
            "Musique libre de droits",
            "Livraison fichiers HD + web"
        ]
    },
    {
        title: "Pack Premium",
        division: Division.STUDIO,
        price: "3,500€",
        priceNote: "Par jour de tournage",
        description: "Production haut de gamme avec équipe complète",
        deliveryTime: "2-3 semaines post-tournage",
        revisions: "3 rounds",
        popular: true,
        highlight: true,
        features: [
            "Équipe complète (réalisateur, cadreur, son)",
            "Tournage 4K/6K (caméras RED/Sony)",
            "Éclairage professionnel",
            "Étalonnage cinéma avancé",
            "Montage multi-formats (10+ versions)",
            "Motion graphics & VFX basiques",
            "Drone + Gimbal stabilisé",
            "Musique originale ou licensing",
            "Livraison 4K + versions optimisées",
            "BTS (Behind The Scenes) inclus"
        ]
    },
    {
        title: "Production Long-Métrage",
        division: Division.STUDIO,
        price: "Sur devis",
        priceNote: "À partir de 15,000€",
        description: "Films, documentaires, séries web",
        deliveryTime: "Selon projet",
        revisions: "Illimitées",
        features: [
            "Pré-production complète (scénario, storyboard)",
            "Équipe technique complète",
            "Tournage multi-caméras",
            "Post-production complète (montage, VFX, son)",
            "Étalonnage professionnel",
            "Mixage audio 5.1",
            "Livraison master + versions multiples",
            "Distribution & stratégie de lancement",
            "Support marketing vidéo"
        ]
    }
];

const BRAND_PACKAGES: PricingPackage[] = [
    {
        title: "Essentiel",
        division: Division.BRAND,
        price: "1,500€",
        priceNote: "Par mois",
        description: "Gestion réseaux sociaux et contenu",
        deliveryTime: "Immédiat",
        revisions: "2 rounds par post",
        features: [
            "Gestion 3 réseaux sociaux",
            "3 Posts créatifs / semaine",
            "Stories quotidiennes",
            "Rapport mensuel d'analyse",
            "Design graphique illimité",
            "Community management (réponses)",
            "Hashtag research & stratégie"
        ]
    },
    {
        title: "Croissance",
        division: Division.BRAND,
        price: "3,500€",
        priceNote: "Par mois",
        description: "Stratégie complète de croissance",
        deliveryTime: "Immédiat",
        revisions: "3 rounds par post",
        popular: true,
        highlight: true,
        features: [
            "Gestion 5 réseaux sociaux",
            "5 Posts créatifs / semaine",
            "Stories + Reels/TikTok",
            "Vidéos courtes (1-2 / mois)",
            "Rapport détaillé hebdomadaire",
            "A/B testing contenu",
            "Influencer outreach",
            "Publicités gérées (budget séparé)",
            "Design graphique + motion",
            "Création identité visuelle (si besoin)"
        ]
    },
    {
        title: "Enterprise Brand",
        division: Division.BRAND,
        price: "Sur devis",
        priceNote: "À partir de 8,000€/mois",
        description: "Agence interne dédiée",
        deliveryTime: "Immédiat",
        revisions: "Illimitées",
        features: [
            "Équipe dédiée (CM, designer, vidéaste)",
            "Contenu illimité (tous formats)",
            "Stratégie de marque complète",
            "Création identité visuelle",
            "Refonte site web incluse",
            "Campagnes publicitaires gérées",
            "Partnerships & collaborations",
            "Reporting temps réel",
            "Support prioritaire 24/7",
            "Formation équipe interne"
        ]
    }
];

const ADDONS = [
    {
        category: "Tech",
        items: [
            { name: "Page supplémentaire", price: "300€" },
            { name: "Intégration CMS (Strapi/Sanity)", price: "1,200€" },
            { name: "E-commerce (basique)", price: "2,500€" },
            { name: "Application mobile (React Native)", price: "5,000€" },
            { name: "Maintenance mensuelle", price: "200€/mois" }
        ]
    },
    {
        category: "Studio",
        items: [
            { name: "Journée supplémentaire", price: "1,200€" },
            { name: "Motion graphics avancés", price: "800€" },
            { name: "VFX & Rotoscopie", price: "1,500€" },
            { name: "Musique originale", price: "600€" },
            { name: "Version longue (documentaire)", price: "2,000€" }
        ]
    },
    {
        category: "Brand",
        items: [
            { name: "Post supplémentaire", price: "150€" },
            { name: "Vidéo courte (1 min)", price: "800€" },
            { name: "Photographie produit", price: "400€" },
            { name: "Refonte logo", price: "1,200€" },
            { name: "Audit de marque complet", price: "2,500€" }
        ]
    }
];

const FAQ_ITEMS = [
    {
        question: "Les prix incluent-ils les taxes ?",
        answer: "Tous nos prix sont indiqués hors taxes (HT). La TVA de 20% s'applique selon votre situation. Les entreprises françaises peuvent récupérer la TVA."
    },
    {
        question: "Proposez-vous des paiements échelonnés ?",
        answer: "Oui, pour les projets supérieurs à 5,000€, nous proposons un paiement en 2-3 fois (30% à la commande, 40% à mi-projet, 30% à la livraison)."
    },
    {
        question: "Que se passe-t-il si je ne suis pas satisfait ?",
        answer: "Nous garantissons 100% de satisfaction. Si le livrable ne correspond pas au brief initial, nous retravaillons gratuitement jusqu'à satisfaction. Nous offrons également une garantie de 3 mois sur tous nos développements."
    },
    {
        question: "Puis-je modifier mon pack en cours de route ?",
        answer: "Absolument ! Vous pouvez upgrader votre pack à tout moment. La différence de prix sera calculée au prorata. Les downgrades sont possibles à la fin de la période en cours."
    },
    {
        question: "Combien de temps pour recevoir un devis personnalisé ?",
        answer: "Nous répondons sous 24h ouvrées. Pour les projets complexes, nous proposons un audit gratuit de 30 minutes pour mieux comprendre vos besoins avant de proposer un devis détaillé."
    },
    {
        question: "Travaillez-vous avec des clients internationaux ?",
        answer: "Oui, nous travaillons avec des clients dans toute l'Europe et au-delà. Les communications peuvent se faire en français, anglais ou espagnol. Les paiements peuvent être effectués en EUR, USD ou GBP."
    }
];

export const Pricing: React.FC = () => {
    const [activeDivision, setActiveDivision] = useState<Division>(Division.TECH);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [showAddons, setShowAddons] = useState(false);
    const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const { faqs, fetchFAQs } = useFAQs();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [packages, faqsData] = await Promise.all([
                    mockDataService.getPricingPackages(),
                    fetchFAQs()
                ]);
                setPricingPackages(packages);
            } catch (error) {
                console.error('Error loading pricing data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [fetchFAQs]);

    const getPackages = () => {
        return pricingPackages.filter(pkg => pkg.division === activeDivision);
    };

    const getAddons = () => {
        switch (activeDivision) {
            case Division.TECH: return ADDONS[0];
            case Division.STUDIO: return ADDONS[1];
            case Division.BRAND: return ADDONS[2];
            default: return ADDONS[0];
        }
    };

    return (
        <div className="px-6 pt-32 pb-20 min-h-screen">
            {/* Hero Section */}
            <div className="mx-auto mb-20 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center space-x-2 bg-white/5 mb-8 px-4 py-1 border border-white/10 rounded-full">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="font-bold text-gray-300 text-xs tracking-wider">TARIFS TRANSPARENTS</span>
                    </div>
                    <h1 className="mb-6 font-bold text-white text-4xl md:text-7xl leading-tight">
                        Accélérateur <span className="bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent">Startup</span>
                    </h1>
                    <p className="mx-auto mb-8 max-w-3xl text-gray-400 text-lg md:text-xl">
                        Des tarifs transparents conçus pour les entreprises agiles. Pas de coûts cachés, juste de la valeur.
                        <span className="block mt-3 font-medium text-white">Choisissez votre division et découvrez nos offres.</span>
                    </p>
                </motion.div>

                {/* Division Selector */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {Object.values(Division).map((division) => (
                        <button
                            key={division}
                            onClick={() => setActiveDivision(division)}
                            className={`px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                                activeDivision === division
                                    ? `${DIVISION_CONFIG[division].bg} ${DIVISION_CONFIG[division].color} border-2 ${DIVISION_CONFIG[division].border}`
                                    : 'bg-white/5 text-gray-400 border-2 border-transparent hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {DIVISION_CONFIG[division].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Pricing Cards */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
            ) : (
                <div className="mx-auto mb-20 max-w-7xl">
                    <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
                        <AnimatePresence mode="wait">
                            {getPackages().map((pkg, idx) => (
                            <motion.div
                                key={`${activeDivision}-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className={`relative bg-[#0a0a16] border rounded-2xl p-8 flex flex-col h-full ${
                                    pkg.highlight
                                        ? `${DIVISION_CONFIG[pkg.division].border} shadow-[0_0_40px_-10px_rgba(168,85,247,0.4)] scale-105 md:scale-105`
                                        : 'border-white/10 hover:border-white/20'
                                } transition-all duration-300`}
                            >
                                {pkg.popular && (
                                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${DIVISION_CONFIG[pkg.division].bg} ${DIVISION_CONFIG[pkg.division].color} text-xs font-bold px-4 py-1.5 rounded-full tracking-wider uppercase border ${DIVISION_CONFIG[pkg.division].border}`}>
                                        <Star className="inline mr-1 w-3 h-3" />
                                        Populaire
                                    </div>
                                )}
                                
                                <div className={`text-xs font-bold tracking-widest mb-2 ${DIVISION_CONFIG[pkg.division].color}`}>
                                    {DIVISION_CONFIG[pkg.division].label.toUpperCase()}
                                </div>
                                
                                <h3 className="mb-2 font-bold text-white text-2xl md:text-3xl">{pkg.title}</h3>
                                
                                {pkg.description && (
                                    <p className="mb-4 text-gray-500 text-sm">{pkg.description}</p>
                                )}
                                
                                <div className="mb-6">
                                    <div className="mb-1 font-bold text-white text-4xl md:text-5xl">{pkg.price}</div>
                                    {pkg.priceNote && (
                                        <p className="text-gray-500 text-xs">{pkg.priceNote}</p>
                                    )}
                                </div>

                                {pkg.deliveryTime && (
                                    <div className="flex items-center space-x-2 mb-4 text-gray-400 text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span>Livraison: {pkg.deliveryTime}</span>
                                    </div>
                                )}

                                {pkg.revisions && (
                                    <div className="flex items-center space-x-2 mb-6 text-gray-400 text-sm">
                                        <FileText className="w-4 h-4" />
                                        <span>Revisions: {pkg.revisions}</span>
                                    </div>
                                )}
                                
                                <ul className="flex-1 space-y-3 mb-8">
                                    {pkg.features.map((feat, i) => (
                                        <li key={i} className="flex items-start space-x-3 text-gray-300 text-sm">
                                            <Check className={`w-5 h-5 ${DIVISION_CONFIG[pkg.division].color} shrink-0 mt-0.5`} />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/contact"
                                    className={`w-full py-3.5 rounded-lg font-bold text-white text-center transition-all duration-300 ${
                                        pkg.highlight
                                            ? `${DIVISION_CONFIG[pkg.division].bg} ${DIVISION_CONFIG[pkg.division].border} border-2 hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)]`
                                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                    }`}
                                >
                                    Choisir ce Pack
                                </Link>
                            </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Add-ons Section */}
            <div className="mx-auto mb-20 max-w-7xl">
                <div className="bg-[#0a0a16] p-8 border border-white/10 rounded-2xl">
                    <button
                        onClick={() => setShowAddons(!showAddons)}
                        className="flex justify-between items-center mb-6 w-full"
                    >
                        <div className="flex items-center space-x-3">
                            <Sparkles className={`w-5 h-5 ${DIVISION_CONFIG[activeDivision].color}`} />
                            <h3 className="font-bold text-white text-xl">Options & Add-ons</h3>
                        </div>
                        {showAddons ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>
                    
                    <AnimatePresence>
                        {showAddons && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                                    {getAddons().items.map((addon, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white/5 p-4 border border-white/10 rounded-lg">
                                            <span className="text-gray-300 text-sm">{addon.name}</span>
                                            <span className={`font-bold ${DIVISION_CONFIG[activeDivision].color}`}>{addon.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Guarantees Section */}
            <div className="mx-auto mb-20 max-w-7xl">
                <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
                    <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 p-6 border border-blue-500/20 rounded-xl">
                        <Shield className="mb-4 w-8 h-8 text-blue-400" />
                        <h4 className="mb-2 font-bold text-white text-lg">Garantie Satisfaction</h4>
                        <p className="text-gray-400 text-sm">100% satisfait ou retravaillé gratuitement jusqu'à satisfaction complète.</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 p-6 border border-purple-500/20 rounded-xl">
                        <Award className="mb-4 w-8 h-8 text-purple-400" />
                        <h4 className="mb-2 font-bold text-white text-lg">Support Prioritaire</h4>
                        <p className="text-gray-400 text-sm">Accès direct à l'équipe, réponse sous 24h, support technique inclus.</p>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 p-6 border border-cyan-500/20 rounded-xl">
                        <TrendingUp className="mb-4 w-8 h-8 text-cyan-400" />
                        <h4 className="mb-2 font-bold text-white text-lg">Évolutif & Flexible</h4>
                        <p className="text-gray-400 text-sm">Upgrade/downgrade à tout moment, paiements échelonnés disponibles.</p>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            {faqs.length > 0 && (
                <div className="mx-auto mb-20 max-w-4xl">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 font-bold text-white text-3xl md:text-4xl">Questions Fréquentes</h2>
                        <p className="text-gray-400">Tout ce que vous devez savoir sur nos tarifs et processus.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-[#0a0a16] border border-white/10 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="flex justify-between items-center hover:bg-white/5 p-6 w-full text-left transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <HelpCircle className="w-5 h-5 text-blue-400 shrink-0" />
                                    <span className="font-bold text-white">{faq.question}</span>
                                </div>
                                {openFaq === idx ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                                )}
                            </button>
                            <AnimatePresence>
                                {openFaq === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <div className="mx-auto max-w-7xl">
                <div className="relative bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 p-12 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />
                    <div className="relative text-center">
                        <h3 className="mb-4 font-bold text-white text-3xl md:text-4xl">
                            Besoin d'une solution sur mesure ?
                        </h3>
                        <p className="mx-auto mb-8 max-w-2xl text-gray-300 text-lg">
                            Nous créons des devis personnalisés pour les projets complexes d'architecture SaaS, 
                            les productions vidéo long-métrage, ou les stratégies de marque enterprise.
                        </p>
                        <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
                            <Link
                                to="/contact"
                                className="inline-flex items-center space-x-2 bg-white hover:bg-gray-200 shadow-lg px-8 py-4 rounded-lg font-bold text-black hover:scale-105 transition-all"
                            >
                                <span>Contacter l'équipe</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/work"
                                className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-8 py-4 border border-white/20 rounded-lg font-bold text-white transition-all"
                            >
                                <span>Voir nos réalisations</span>
                            </Link>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-gray-400 text-sm">
                            <div className="flex items-center space-x-2">
                                <CreditCard className="w-4 h-4" />
                                <span>Paiements sécurisés</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>Réponse sous 24h</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>Consultation gratuite</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};