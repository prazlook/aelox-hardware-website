import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showError } from "@/utils/toast";

const ConfigurationPage = () => {
  const [overheatSoundFile, setOverheatSoundFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("audio/")) {
        setOverheatSoundFile(file);
      } else {
        showError("Veuillez sélectionner un fichier audio valide.");
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 sm:p-8 text-white">
      <h1 className="text-4xl font-light tracking-wider mb-8">CONFIGU<span className="font-bold">RATION</span></h1>
      <main className="space-y-8">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle>Sons d'Alerte</CardTitle>
            <CardDescription className="text-gray-400">
              Importez des fichiers audio personnalisés pour les alertes. Les sons ne sont pas conservés après le rechargement de la page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
              <div>
                <p className="font-medium">Alerte de Surchauffe</p>
                <p className="text-sm text-gray-400">
                  {overheatSoundFile ? overheatSoundFile.name : "Aucun son sélectionné"}
                </p>
              </div>
              <Button onClick={handleButtonClick}>Choisir un fichier</Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="audio/*"
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default ConfigurationPage;