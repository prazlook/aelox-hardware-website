import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAsics, ASIC, ASICStatus } from "@/context/AsicContext";

const ALL_STATUSES: ASICStatus[] = ['online', 'offline', 'booting up', 'shutting down', 'overclocked', 'overheat', 'error', 'idle', 'standby'];

const DevOptionsPage = () => {
  const { asics, setAsics } = useAsics();

  const handleUpdate = (id: string, field: keyof ASIC, value: any) => {
    setAsics(prev =>
      prev.map(asic => {
        if (asic.id === id) {
          const updatedValue = typeof asic[field] === 'number' ? parseFloat(value) || 0 : value;
          return { ...asic, [field]: updatedValue };
        }
        return asic;
      })
    );
  };

  return (
    <div className="p-4 sm:p-8 text-white">
      <h1 className="text-4xl font-light tracking-wider mb-8">OPTIONS <span className="font-bold">DÉVELOPPEUR</span></h1>
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
                  <SelectContent>
                    {ALL_STATUSES.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`hashrate-${asic.id}`}>Hashrate</Label>
                  <Input
                    id={`hashrate-${asic.id}`}
                    type="number"
                    value={asic.hashrate}
                    onChange={(e) => handleUpdate(asic.id, 'hashrate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`temp-${asic.id}`}>Température</Label>
                  <Input
                    id={`temp-${asic.id}`}
                    type="number"
                    value={asic.temperature}
                    onChange={(e) => handleUpdate(asic.id, 'temperature', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`power-${asic.id}`}>Puissance</Label>
                  <Input
                    id={`power-${asic.id}`}
                    type="number"
                    value={asic.power}
                    onChange={(e) => handleUpdate(asic.id, 'power', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`fan-${asic.id}`}>Ventilateur (%)</Label>
                  <Input
                    id={`fan-${asic.id}`}
                    type="number"
                    value={asic.fanSpeed}
                    onChange={(e) => handleUpdate(asic.id, 'fanSpeed', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
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