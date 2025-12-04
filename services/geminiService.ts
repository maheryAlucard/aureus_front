import { GoogleGenAI } from "@google/genai";
import { env } from '../config/env';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const getAiClient = () => {
  const apiKey = env.geminiApiKey;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProjectDescription = async (title: string, division: string, tags: string[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Configuration AI manquante. Veuillez définir VITE_GEMINI_API_KEY.";

  try {
    const prompt = `
      Rédigez une description de projet concise, percutante et professionnelle (environ 50 mots) en français pour une étude de cas d'agence digitale.
      Titre du projet : ${title}
      Division : ${division} (Contexte : ${division === 'TECH' ? 'Développement Logiciel/Web' : division === 'STUDIO' ? 'Vidéo/Animation' : 'Branding/Design'})
      Technologies clés/Tags : ${tags.join(', ')}
      
      Ton : Futuriste, premium et orienté résultats.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Échec de la génération de la description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erreur lors de la génération du contenu. Veuillez réessayer.";
  }
};

export const sendChatMessage = async (message: string, history: ChatMessage[] = []): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return "Configuration AI manquante. Veuillez définir VITE_GEMINI_API_KEY dans votre fichier .env";
  }

  try {
    // Build conversation context with system prompt and history
    let conversationContext = `Tu es un assistant IA pour Aureus, une agence digitale premium avec trois divisions :
- Aureus Tech : Développement web/app, automatisation & IA, consulting tech
- Aureus Studio : Vidéo, 3D, VFX, production et post-production
- Aureus Brand : Branding, identité visuelle, growth & social media

Réponds de manière professionnelle, amicale et concise en français. Aide les visiteurs à comprendre nos services et réponds à leurs questions.

Historique de la conversation :
`;

    // Add conversation history (excluding the initial greeting)
    history.forEach((msg, index) => {
      if (index > 0) { // Skip the first assistant greeting
        conversationContext += `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}\n\n`;
      }
    });

    conversationContext += `\nUtilisateur: ${message}\nAssistant:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: conversationContext,
    });

    return response.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      return "Erreur de configuration : Vérifiez que votre clé API Gemini est correctement configurée dans le fichier .env (VITE_GEMINI_API_KEY).";
    }
    return "Erreur lors de l'envoi du message. Veuillez réessayer.";
  }
};

export interface DevisGenerationParams {
  clientName: string;
  clientEmail: string;
  companyName?: string;
  division: string;
  projectDescription: string;
  budget?: string;
  deadline?: string;
  additionalRequirements?: string;
}

export const generateDevis = async (params: DevisGenerationParams): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return "Configuration AI manquante. Veuillez définir VITE_GEMINI_API_KEY.";
  }

  try {
    const divisionInfo = {
      'TECH': 'Aureus Tech - Développement web/app, automatisation & IA, consulting tech',
      'STUDIO': 'Aureus Studio - Vidéo, 3D, VFX, production et post-production',
      'BRAND': 'Aureus Brand - Branding, identité visuelle, growth & social media'
    };

    const prompt = `Tu es un expert en rédaction de devis professionnels pour Aureus, une agence digitale premium.

Génère un devis complet et professionnel en français pour le projet suivant :

**Informations client :**
- Nom : ${params.clientName}
- Email : ${params.clientEmail}
${params.companyName ? `- Entreprise : ${params.companyName}` : ''}

**Projet :**
- Division : ${divisionInfo[params.division as keyof typeof divisionInfo] || params.division}
- Description : ${params.projectDescription}
${params.budget ? `- Budget estimé : ${params.budget}` : ''}
${params.deadline ? `- Délai souhaité : ${params.deadline}` : ''}
${params.additionalRequirements ? `- Exigences supplémentaires : ${params.additionalRequirements}` : ''}

**Instructions :**
1. Structure le devis de manière professionnelle avec :
   - Un en-tête avec les informations de contact d'Aureus
   - Une section "Objet du devis" décrivant le projet
   - Une section "Prestations proposées" détaillant les services
   - Une section "Délais de réalisation"
   - Une section "Tarification" (si budget fourni, l'utiliser comme référence, sinon proposer une estimation)
   - Une section "Conditions générales"
   - Une section "Prochaines étapes"

2. Sois précis, professionnel et orienté résultats
3. Adapte le ton selon la division (Tech = technique et précis, Studio = créatif et visuel, Brand = stratégique et marketing)
4. Inclus des détails pertinents basés sur la description du projet
5. Utilise un format clair et structuré avec des titres de sections

Génère maintenant le devis complet :`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Échec de la génération du devis.";
  } catch (error) {
    console.error("Gemini Devis Generation Error:", error);
    return "Erreur lors de la génération du devis. Veuillez réessayer.";
  }
};