import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { SoundUploader } from "@/components/SoundUploader";
import { useSound } from "@/context/SoundContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDevOptions } from "@/context/DevOptionsContext";

const ConfigurationPage = () => {
  const {
    overheatSoundFile,
    setOverheatSoundFile,
    powerOnSoundFile,
    setPowerOnSoundFile,
    powerOffSoundFile,
    setPowerOffSoundFile
  } = useSound();

  const {
    startupDelay,
    setStartupDelay,
    shutdownDelay,
    setShutdownDelay,
  } = useDevOptions();

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

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle>Délais de Démarrage et d'Arrêt</CardTitle>
            <CardDescription className="text-gray-400">
              Configurez les délais en secondes pour les transitions de statut des ASICs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startup-delay">Délai de Démarrage (secondes)</Label>
              <Input
                id="startup-delay"
                type="number"
                value={startupDelay}
                onChange={(e) => setStartupDelay(Math.max(0, parseFloat(e.target.value) || 0))}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shutdown-delay">Délai d'Arrêt (secondes)</Label>
              <Input
                id="shutdown-delay"
                type="number"
                value={shutdownDelay}
                onChange={(e) => setShutdownDelay(Math.max(0, parseFloat(e.target.value) || 0))}
                min="0"
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