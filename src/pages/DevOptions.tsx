"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAsics } from "@/context/AsicContext";
import { type ASIC, type ASICStatus } from "@/context/AsicContext";
import { useDevOptions } from "@/context/DevOptionsContext";

const DevOptionsPage = () => {
  const ALL_STATUSES: ASICStatus[] = ['online', 'offline', 'booting up', 'shutting down', 'overclocked', 'overheat', 'error', 'idle', 'standby'];
  const { asics, setAsics } = useAsics();
  const { preventOverheat, setPreventOverheat, preventErrors, setPreventErrors } = useDevOptions();

  const handleUpdate = (id: string, field: keyof ASIC, value: any) => {
    setAsics(prev =>
      prev.map(asic => {
        if (asic.id === id) {
          const updatedValue = typeof asic[field] === 'number' || field.startsWith('fixed') ? parseFloat(value) || 0 : value;
          return { ...asic, [field]: updatedValue };
        }
        return asic;
      })
    );
  };

  return (
    <div className="p-4 sm:p-8 text-white">
      <h1 className="text-4xl font-light tracking-wider mb-8">OPTIONS <span className="font-bold">DÉVELOPPEUR</span></h1>
      
      <Card className="bg-gray-900/50 border-gray-700 mb-6">
        <CardHeader>
          <CardTitle>Paramètres de Simulation Globaux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
            <Label htmlFor="prevent-overheat" className="flex flex-col space-y-1 cursor-pointer">
              <span>Interdire les surchauffes</span>
              <span className="font-normal leading-snug text-gray-400 text-sm">
                Empêche les ASICs de surchauffer et régule leur température.
              </span>
            </Label>
            <Switch
              id="prevent-overheat"
              checked={preventOverheat}
              onCheckedChange={setPreventOverheat}
            />
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
            <Label htmlFor="prevent-errors" className="flex flex-col space-y-1 cursor-pointer">
              <span>Interdire les erreurs</span>
              <span className="font-normal leading-snug text-gray-400 text-sm">
                Empêche les ASICs de passer en état d'erreur critique.
              </span>
            </Label>
            <Switch
              id="prevent-errors"
              checked={preventErrors}
              onCheckedChange={setPreventErrors}
            />
          </div>
        </CardContent>
      </Card>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {asics.map(asic => (
          <Card key={asic.id} className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle>{asic.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`status-${asic.id}`}>Statut</Label>
                <Select
                  value={asic.status}
                  onValueChange={(value) => handleUpdate(asic.id, 'status', value)}
                >
                  <SelectTrigger id={`status-${asic.id}`}>
                    <SelectValue placeholder="Choisir un statut" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="bg-gray-900 border-gray-700 text-white">
                    {ALL_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                <div className="space-y-2">
                  <Label className="text-theme-cyan">Vitesse Fixe</Label>
                  <Input
                    type="number"
                    value={asic.fixedSpeed ?? asic.hashrate}
                    onChange={(e) => handleUpdate(asic.id, 'fixedSpeed', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-theme-cyan">Temp. Fixe</Label>
                  <Input
                    type="number"
                    value={asic.fixedTemperature ?? asic.temperature}
                    onChange={(e) => handleUpdate(asic.id, 'fixedTemperature', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-theme-cyan">Puis. Fixe</Label>
                  <Input
                    type="number"
                    value={asic.fixedPower ?? asic.power}
                    onChange={(e) => handleUpdate(asic.id, 'fixedPower', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-theme-cyan">Vent. Fixe (%)</Label>
                  <Input
                    type="number"
                    value={asic.fixedFanSpeed ?? asic.fanSpeed}
                    onChange={(e) => handleUpdate(asic.id, 'fixedFanSpeed', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id={`fan-on-${asic.id}`}
                  checked={asic.isFanOn}
                  onCheckedChange={(checked) => handleUpdate(asic.id, 'isFanOn', checked)}
                />
                <Label htmlFor={`fan-on-${asic.id}`}>Ventilateur Actif</Label>
              </div>
               <div className="space-y-2">
                <Label htmlFor={`comment-${asic.id}`}>Commentaire</Label>
                <Textarea
                  id={`comment-${asic.id}`}
                  value={asic.comment}
                  onChange={(e) => handleUpdate(asic.id, 'comment', e.target.value)}
                  placeholder="Ajouter un commentaire..."
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
};

export default DevOptionsPage;