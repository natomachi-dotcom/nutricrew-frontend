// FAQ content shown in the in-app FAQ modal (SplashScreen → FAQModal). The
// pricing answer (index 1 in every language) below is the TRIAL_ENABLED=true
// copy, preserved for when the trial campaign is re-enabled — see
// PRICING_ANSWER_NO_TRIAL and getFAQ() below for the current
// (TRIAL_ENABLED=false) launch copy actually shown by default. Note: the
// $7.99/$62.32/35% figures here are kept current even in this trial-era
// answer, since price is a business decision independent of TRIAL_ENABLED —
// checkout charges the same $62.32/yr annual price either way (see
// nutricrew-backend/server.js's create-checkout-session). Only the trial
// MECHANIC wording ("add a card to start your trial") is what's specific to
// TRIAL_ENABLED=true and preserved here.
export const FAQ = {
  en: [
    {
      q: "What is NutriCrew?",
      a: "NutriCrew builds a personalized meal, hydration, and jet-lag plan for each pairing based on your flight schedule, destinations, dietary needs, and kitchen access.",
    },
    {
      q: "Is NutriCrew free to use?",
      a: "Your first month is free — add a card to start your trial, then it's $7.99/month or $62.32/year (save 35%). Cancel anytime before the trial ends and you won't be charged. Viewing plans you've already saved is always free.",
    },
    {
      q: "How is my meal plan generated?",
      a: "We use your pairing details (departure, destinations, duty days, layovers), your goals and food restrictions, and kitchen access per day to build a plan tailored to that specific trip.",
    },
    {
      q: "What if I don't have kitchen access during a layover?",
      a: "Each day of your pairing asks about kitchen access separately, so meals for days without a kitchen focus on packable, no-cook, or crew-meal-friendly options.",
    },
    {
      q: "Can I use NutriCrew offline?",
      a: "Yes. Your most recently saved plan is cached and opens automatically if you have no internet connection. Generating a brand-new plan requires connectivity.",
    },
    {
      q: "What is the referral program?",
      a: "Share your invite link with fellow crew. When a friend signs up using it, you both receive a free bonus pairing plan.",
    },
    {
      q: "How do I change the app language?",
      a: "Tap the language selector (EN / FR / ES) at the top of the splash screen at any time.",
    },
    {
      q: "How do I cancel Premium?",
      a: "Manage or cancel your subscription from the Profile screen, or contact us and we'll take care of it.",
    },
    {
      q: "How do I get help or report a problem?",
      a: "Email us at crewmealplans@nutricrew.ca — we typically respond within one business day.",
    },
  ],
  fr: [
    {
      q: "Qu'est-ce que NutriCrew ?",
      a: "NutriCrew crée un plan personnalisé de repas, d'hydratation et de gestion du décalage horaire pour chaque rotation, selon votre horaire de vol, vos destinations, vos besoins alimentaires et votre accès à une cuisine.",
    },
    {
      q: "NutriCrew est-il gratuit ?",
      a: "Votre premier mois est gratuit — ajoutez une carte pour démarrer l'essai, puis c'est 7,99 $/mois ou 62,32 $/an (économisez 35 %). Annulez avant la fin de l'essai et vous ne serez pas facturé. Consulter les plans déjà enregistrés reste toujours gratuit.",
    },
    {
      q: "Comment le plan de repas est-il généré ?",
      a: "Nous utilisons les détails de votre rotation (départ, destinations, jours de service, escales), vos objectifs, vos restrictions alimentaires et votre accès à une cuisine chaque jour pour créer un plan adapté à ce voyage précis.",
    },
    {
      q: "Que se passe-t-il si je n'ai pas accès à une cuisine pendant une escale ?",
      a: "Chaque jour de votre rotation indique séparément l'accès à une cuisine, afin que les repas des jours sans cuisine privilégient des options transportables, sans cuisson ou compatibles avec les repas d'équipage.",
    },
    {
      q: "Puis-je utiliser NutriCrew hors ligne ?",
      a: "Oui. Votre dernier plan enregistré est mis en cache et s'ouvre automatiquement sans connexion internet. La génération d'un nouveau plan nécessite une connexion.",
    },
    {
      q: "Qu'est-ce que le programme de parrainage ?",
      a: "Partagez votre lien d'invitation avec vos collègues. Quand un ami s'inscrit grâce à ce lien, vous recevez tous les deux un plan de rotation bonus gratuit.",
    },
    {
      q: "Comment changer la langue de l'application ?",
      a: "Appuyez sur le sélecteur de langue (EN / FR / ES) en haut de l'écran d'accueil, à tout moment.",
    },
    {
      q: "Comment annuler mon abonnement Premium ?",
      a: "Gérez ou annulez votre abonnement depuis l'écran Profil, ou contactez-nous et nous nous en occuperons.",
    },
    {
      q: "Comment obtenir de l'aide ou signaler un problème ?",
      a: "Écrivez-nous à crewmealplans@nutricrew.ca — nous répondons généralement sous un jour ouvrable.",
    },
  ],
  es: [
    {
      q: "¿Qué es NutriCrew?",
      a: "NutriCrew crea un plan personalizado de comidas, hidratación y jet lag para cada rotación, según tu horario de vuelo, destinos, necesidades alimentarias y acceso a cocina.",
    },
    {
      q: "¿Es gratis usar NutriCrew?",
      a: "Tu primer mes es gratis — agrega una tarjeta para iniciar la prueba, luego son $7.99/mes o $62.32/año (ahorra 35%). Cancela antes de que termine la prueba y no se te cobrará. Ver los planes que ya guardaste siempre es gratis.",
    },
    {
      q: "¿Cómo se genera mi plan de comidas?",
      a: "Usamos los detalles de tu rotación (salida, destinos, días de servicio, escalas), tus objetivos y restricciones alimentarias, y el acceso a cocina de cada día para crear un plan adaptado a ese viaje específico.",
    },
    {
      q: "¿Qué pasa si no tengo acceso a cocina durante una escala?",
      a: "Cada día de tu rotación pregunta el acceso a cocina por separado, así que las comidas de los días sin cocina se enfocan en opciones para llevar, sin cocción o compatibles con comidas de tripulación.",
    },
    {
      q: "¿Puedo usar NutriCrew sin conexión?",
      a: "Sí. Tu plan guardado más reciente queda en caché y se abre automáticamente si no tienes conexión a internet. Generar un plan nuevo requiere conexión.",
    },
    {
      q: "¿Qué es el programa de referidos?",
      a: "Comparte tu enlace de invitación con tus compañeros de tripulación. Cuando un amigo se registra con él, ambos reciben un plan de rotación adicional gratis.",
    },
    {
      q: "¿Cómo cambio el idioma de la app?",
      a: "Toca el selector de idioma (EN / FR / ES) en la parte superior de la pantalla de inicio en cualquier momento.",
    },
    {
      q: "¿Cómo cancelo Premium?",
      a: "Gestiona o cancela tu suscripción desde la pantalla de Perfil, o contáctanos y nosotros nos encargamos.",
    },
    {
      q: "¿Cómo obtengo ayuda o reporto un problema?",
      a: "Escríbenos a crewmealplans@nutricrew.ca — normalmente respondemos dentro de un día hábil.",
    },
  ],
};

// Launch model (TRIAL_ENABLED=false): first pairing free, no card, no trial —
// then a paid subscription. Kept separate from FAQ's trial-era answers above
// so flipping TRIAL_ENABLED back on later restores that original copy
// untouched instead of needing to be rewritten.
const PRICING_ANSWER_NO_TRIAL = {
  en: "Your first pairing is free — no card required. After that, it's $7.99/month or $62.32/year (save 35%). Cancel anytime from your account. Viewing plans you've already saved is always free.",
  fr: "Votre premier pairing est gratuit — aucune carte requise. Ensuite, c'est 7,99 $/mois ou 62,32 $/an (économisez 35 %). Annulez à tout moment depuis votre compte. Consulter les plans déjà enregistrés reste toujours gratuit.",
  es: "Tu primer pairing es gratis — no se requiere tarjeta. Después, son $7.99/mes o $62.32/año (ahorra 35%). Cancela cuando quieras desde tu cuenta. Ver los planes que ya guardaste siempre es gratis.",
};

// Returns this language's FAQ items, swapping in the correct pricing answer
// (index 1, "Is NutriCrew free to use?") for the current TRIAL_ENABLED state.
export function getFAQ(lang, trialEnabled) {
  const base = FAQ[lang] || FAQ.en;
  if (trialEnabled) return base;
  const notrial = PRICING_ANSWER_NO_TRIAL[lang] || PRICING_ANSWER_NO_TRIAL.en;
  return base.map((item, i) => (i === 1 ? { ...item, a: notrial } : item));
}
