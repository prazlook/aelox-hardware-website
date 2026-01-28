import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Ne pas oublier d'importer le tagger si Dyad l'utilise
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";

export default defineConfig({
  // C'est CETTE ligne qui automatise tout le bazar des chemins
  base: "/aelox-hardware-website/", 
  
  plugins: [
    react(),
    dyadComponentTagger(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optionnel : s'assure que les assets vont dans un dossier propre
    outDir: "dist",
  }
});
