import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ASIC } from "@/components/ASICStatusCard";

export async function getAIComment(asic: ASIC, apiKey: string | null): Promise<string> {
  if (!apiKey) {
    return "Clé API non configurée.";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text.trim();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
      return "Clé API invalide.";
    }
    return "Erreur de l'IA.";
  }
}