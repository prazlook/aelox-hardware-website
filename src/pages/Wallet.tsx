import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { showSuccess } from "@/utils/toast";
import { MadeWithDyad } from "@/components/made-with-dyad";

const MOCK_WALLET_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `Jour ${i + 1}`,
  value: 1000 + i * 50 + Math.random() * 100,
}));

const WalletPage = () => {
  const [balance, setBalance] = useState(2450.78);

  const handleSell = () => {
    showSuccess("Vente réussie ! Votre solde a été transféré.");
    setBalance(0);
  };

  return (
    <div className="p-4 sm:p-8 text-white">
      <h1 className="text-4xl font-light tracking-wider mb-8">PORTE<span className="font-bold">FEUILLE</span></h1>
      <main className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-400">Solde Actuel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{balance.toFixed(2)} <span className="text-2xl text-gray-400">€</span></p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-400">Crypto Accumulée</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">0.058 <span className="text-2xl text-gray-400">BTC</span></p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-400">Blocs Trouvés (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">3</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900/50 border-gray-700 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Évolution de la Valeur du Portefeuille</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={MOCK_WALLET_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.5)" />
                <YAxis stroke="rgba(255, 255, 255, 0.5)" domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(20, 20, 20, 0.8)', borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                <Line type="monotone" dataKey="value" name="Valeur (€)" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="lg" disabled={balance === 0}>Vendre Maintenant</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la vente ?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  Vous êtes sur le point de vendre 0.058 BTC pour {balance.toFixed(2)} €. Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 border-0">Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleSell} className="bg-red-600 hover:bg-red-700">Confirmer la Vente</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default WalletPage;