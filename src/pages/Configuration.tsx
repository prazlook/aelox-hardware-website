import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { SoundUploader } from "@/components/SoundUploader";
import { useSound } from "@/context/SoundContext";

const ConfigurationPage = () => {
  const {
    overheatSoundFile,
    setOverheatSoundFile,
    powerOnSoundFile,
    setPowerOnSoundFile,
    powerOffSoundFile,
    setPowerOffSoundFile
  } = useSound();

  return (
    <div className="p-4 sm:p-8 text-white">
      <h1 className="text-4xl font-light tracking-wider mb-8">CONFIGU<span className="font-bold">RATION</span></h1>
      <main className="space-y-8">
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle>Sons d'Alerte et de Statut</CardTitle>
            <CardDescription className="text-gray-400">
              Importez des fichiers audio personnalisés. Les sons ne sont pas conservés après le rechargement de la page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SoundUploader
              label="Alerte de Surchauffe"
              selectedFileName={overheatSoundFile?.name || null}
              onFileSelect={setOverheatSoundFile}
            />
            <SoundUploader
              label="Allumage d'un ASIC"
              selectedFileName={powerOnSoundFile?.name || null}
              onFileSelect={setPowerOnSoundFile}
            />
            <SoundUploader
              label="Extinction d'un ASIC"
              selectedFileName={powerOffSoundFile?.name || null}
              onFileSelect={setPowerOffSoundFile}
            />
          </CardContent>
        </Card>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default ConfigurationPage;