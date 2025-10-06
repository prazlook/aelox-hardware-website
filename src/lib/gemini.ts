import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ASIC } from "@/components/ASICStatusCard";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is not set in the environment variables. AI features will be disabled.");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

export async function getAIComment(asic: ASIC): Promise<string> {
  if (!model) {
    return "Le service IA n'est pas configuré.";
  }

  const prompt = `
    Tu es un assistant IA pour un tableau de bord de ferme de minage de cryptomonnaies.
    Génère un commentaire de statut très court (10 mots maximum), percutant ou informatif pour un mineur ASIC. Le commentaire doit être en français.
    Ne retourne que le commentaire, sans aucune phrase d'introduction comme "Voici un commentaire :".

    Détails de l'ASIC :
    - Nom : ${asic.name}
    - Modèle : ${asic.model}
    - Statut actuel : ${asic.status}
    - Hashrate : ${asic.hashrate.toFixed(2)} TH/s
    - Température : ${asic.temperature.toFixed(2)}°C

    Basé sur son statut "${asic.status}", fournis un commentaire approprié.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text.trim();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "Impossible de générer un commentaire IA.";
  }
}