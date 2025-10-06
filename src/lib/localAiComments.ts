import type { ASIC } from "@/components/ASICStatusCard";

const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const comments = {
  online: {
    lowTemp: [
      "Température basse, tout est sous contrôle.",
      "Froid comme un iceberg, efficace comme jamais.",
      "Opérationnel et au frais. Parfait.",
    ],
    optimal: [
      "Température idéale, performance stable.",
      "Tout roule. Efficacité maximale.",
      "En vitesse de croisière. RAS.",
      "Fonctionnement nominal. Zéro souci.",
    ],
    highTemp: [
      "Ça chauffe un peu, mais rien d'alarmant.",
      "Surveille la température, elle grimpe.",
      "Proche de la limite, mais stable.",
      "Ventilateurs à plein régime pour compenser.",
    ],
  },
  overclocked: [
    "Poussé au maximum, ça carbure !",
    "Surcadencé et stable, un vrai monstre.",
    "Mode performance activé. Hashrate au top.",
    "Repousse les limites. Attention à la chaleur.",
  ],
  overheat: [
    "SURCHAUFFE CRITIQUE ! Refroidissement d'urgence.",
    "Trop chaud ! Minage suspendu pour refroidir.",
    "Alerte température ! Arrêt temporaire.",
  ],
  error: [
    "Erreur système détectée. Intervention requise.",
    "Problème matériel. Diagnostic en cours.",
    "Une erreur inattendue est survenue.",
    "Nécessite une maintenance. Erreur critique.",
  ],
  'booting up': [
    "Initialisation des systèmes...",
    "Démarrage en cours, un instant.",
    "Vérification des paramètres avant lancement.",
  ],
  'shutting down': [
    "Procédure d'arrêt en cours.",
    "Extinction des systèmes. À bientôt.",
    "Sauvegarde des données avant arrêt.",
  ],
  idle: [
    "En attente de commandes.",
    "Machine inactive, prête à démarrer.",
    "Mode pause. Économie d'énergie.",
  ],
  standby: [
    "En veille. Consommation minimale.",
    "Mode basse consommation activé.",
    "Prêt à redémarrer sur commande.",
  ],
  offline: [
    "Machine hors ligne.",
    "Déconnecté du réseau.",
    "Arrêt complet.",
  ],
};

export function getLocalAIComment(asic: ASIC): string {
  const { status, temperature } = asic;

  if (status === 'online') {
    if (temperature < 50) return pickRandom(comments.online.lowTemp);
    if (temperature > 75) return pickRandom(comments.online.highTemp);
    return pickRandom(comments.online.optimal);
  }

  if (comments[status]) {
    return pickRandom(comments[status as keyof typeof comments]);
  }

  return "Statut inconnu.";
}