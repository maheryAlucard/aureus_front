<div align="center">
  <img width="1200" height="475" alt="Agence Digitale Aureus Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Agence Digitale Aureus

**Agence Aureus** est une application front React/Vite pour une agence digitale premium structurée autour de trois pôles :

- **Aureus Tech** – Développement web/app, automatisation & IA, consulting tech  
- **Aureus Studio** – Vidéo, 3D, VFX, production et post‑production  
- **Aureus Brand** – Branding, identité visuelle, growth & social media  

Le site inclut une **home cinématique**, des pages dédiées (`Solutions`, `Work`, `Pricing`, `Blog`, `Contact`) ainsi qu’un **tableau de bord Admin** pour gérer projets, leads et contenus. Une intégration à l’API **Gemini** permet de générer automatiquement des descriptions de projets.

---

## Stack technique

- **Frontend**: React 19, TypeScript, Vite 6  
- **Routing**: `react-router-dom` (SPA avec `HashRouter`)  
- **Animations**: `framer-motion`  
- **UI Icons**: `lucide-react`  
- **IA**: `@google/genai` (Gemini 2.5 Flash) via `services/geminiService.ts`

---

## Prérequis

- **Node.js** (version récente LTS recommandée)
- Une clé API **Google Gemini**

---

## Configuration

1. Créez un fichier d’environnement (par ex. `.env.local` ou `.env`) à la racine du projet.  
2. Ajoutez votre clé Gemini :

   ```bash
   API_KEY="VOTRE_CLE_GEMINI"
   ```

> L’API est utilisée dans `services/geminiService.ts` pour générer automatiquement des descriptions de projets (études de cas) en français, ton futuriste et orienté résultats.

---

## Installation & lancement en local

1. **Installer les dépendances**

   ```bash
   npm install
   ```

2. **Lancer le serveur de dev**

   ```bash
   npm run dev
   ```

3. Ouvrez le navigateur sur l’URL indiquée par Vite (généralement `http://localhost:5173`).

---

## Navigation principale

- **`/` (Home)** – Landing page immersive présentant les 3 divisions Aureus, métriques, méthodologie et extraits de blog.  
- **`/solutions`** – Présentation des offres par division (`Tech`, `Studio`, `Brand`).  
- **`/work`** – Études de cas / portfolio (projets structurés par `Division`, tags, etc.).  
- **`/pricing`** – Grilles tarifaires et offres packagées.  
- **`/blog`** – Articles d’analyse et de veille.  
- **`/contact`** – Formulaire de prise de brief et de collecte de leads.  
- **`/admin`** – Tableau de bord admin (gestion des projets, leads, contenus), sans `Navbar`/`Footer` publics.

> La navigation est gérée dans `App.tsx` via `HashRouter` pour un déploiement simple sur des hébergeurs statiques.

---

## Scripts NPM

- **`npm run dev`** – Démarre le serveur de développement Vite.  
- **`npm run build`** – Génère la version de production.  
- **`npm run preview`** – Prévisualise le build de production en local.

---

## Déploiement

1. Construisez le projet :

   ```bash
   npm run build
   ```

2. Déployez le dossier `dist` sur l’hébergeur statique de votre choix (Netlify, Vercel, GitHub Pages, etc.).  
3. Assurez‑vous que la variable d’environnement `API_KEY` est bien configurée côté serveur / plateforme si vous utilisez l’IA en production.

---

## Personnalisation

- **Branding & contenu** : adaptez les textes, images et sections dans les composants de `pages/` et `components/`.  
- **Offres & divisions** : modifiez `DIVISION_CONFIG` et les types partagés dans `types.ts`.  
- **IA / Gemini** : ajustez le prompt ou le modèle dans `services/geminiService.ts` selon vos besoins.

Ce projet sert de base solide pour un site d’agence moderne, animé et orienté conversion, facilement extensible vers des fonctionnalités plus avancées (auth, CRM, automatisations, etc.).
