import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProjectDescription = async (title: string, division: string, tags: string[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Configuration AI manquante. Veuillez définir API_KEY.";

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