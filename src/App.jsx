import { useState, useEffect } from "react";

// AI backend base URL. Empty in local dev (Vite proxies /api to localhost:3001);
// set VITE_API_BASE_URL on Vercel to point at the deployed nutricrew-backend.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// ─── DESIGN TOKENS ────────────────────────────────────────────────
const C = {
  navy:    "#0A1628",
  navyMid: "#0F2040",
  navyCard:"#152850",
  navyBorder:"#1E3A6E",
  gold:    "#C9A84C",
  goldLight:"#E8C96A",
  sky:     "#4A9ECC",
  skyLight:"#7BBFE0",
  green:   "#4CAF7D",
  white:   "#F8FAFF",
  muted:   "#7A8EAA",
  red:     "#E05555",
  bg:      "#07101E",
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────
const T = {
  en: {
    tagline: "Fuel Your Flight",
    tagline_sub: "Nutrition, jet lag, and meal planning built for flight crews",
    start: "Begin Check-In",
    step_lang: "Select Language",
    step_name: "Full Name",
    step_email: "Email Address",
    step_gender: "Gender",
    step_weight: "Weight",
    step_age: "Your Age",
    step_position: "Your Role",
    step_pairing: "Pairing Length",
    step_route: "Your Route",
    destination_label: "Destination",
    step_usa: "Flying to the USA?",
    step_kitchen: "Kitchen Access",
    step_diet: "Your Diet",
    step_goals: "Your Goals",
    step_budget: "Your Budget",
    continue: "Continue →",
    back: "← Back",
    generate: "Generate My Plan",
    boarding_title: "BOARDING PASS",
    day: "Day",
    days: "Days",
    male: "Male", female: "Female", other: "Other / Prefer not to say",
    pilot: "Pilot", cabin: "Cabin Crew", mechanic: "Mechanic",
    ground: "Ground Staff", atc: "Air Traffic Control", dispatch: "Dispatcher", other_role: "Other",
    yes: "Yes", no: "No",
    full_kitchen: "Full Kitchen at Home", hotel_no_kitchen: "Hotel (No Kitchen)",
    microwave: "Microwave Only", airplane_food: "Airplane Meals Provided",
    no_restrictions: "No Restrictions", vegetarian: "Vegetarian",
    vegan: "Vegan", gluten_free: "Gluten-Free", halal: "Halal",
    kosher: "Kosher", low_carb: "Low-Carb / Keto",
    dairy_free: "Dairy-Free", mediterranean: "Mediterranean", carnivore: "Carnivore",
    calorie_deficit: "Calorie Deficit ⭐",
    diet_other: "Other", diet_other_placeholder: "Tell us about your diet...",
    lose_weight: "Lose Weight", keep_weight: "Maintain Weight",
    stay_focused: "Stay Focused & Alert", no_bloating: "Avoid Bloating",
    energy: "Sustained Energy", muscle: "Maintain Muscle", sleep: "Better Sleep",
    budget_day: "Per Day", budget_total: "Total Pairing",
    kg: "kg", lbs: "lbs",
    hours_diff: "Hours difference from home",
    jetlag_note: "Jetlag detected — meals adjusted for your circadian rhythm",
    jetlag_title: "Jet Lag Control",
    jetlag_advisory: "Jet Lag Advisory",
    jetlag_diff_label: "Time difference",
    jetlag_hours: "hours",
    jetlag_ahead: "ahead",
    jetlag_behind: "behind",
    jetlag_none_title: "No Significant Jet Lag",
    jetlag_none_text: "Your route has a time difference of less than 4 hours — your body clock shouldn't need major adjustments. Stay hydrated and keep a regular meal schedule.",
    jetlag_eastward_title: "Advance Your Body Clock",
    jetlag_eastward_text: "Your destination is ahead of home. Shift your sleep and meals earlier each day before departure if possible, and get bright light in the morning at your destination.",
    jetlag_westward_title: "Delay Your Body Clock",
    jetlag_westward_text: "Your destination is behind home. Stay up later and delay meals and sleep gradually, and get bright light in the evening at your destination.",
    jetlag_tips_title: "General Tips",
    jetlag_tip_1: "Stay hydrated — drink plenty of water and limit alcohol and caffeine during the flight.",
    jetlag_tip_2: "Get natural daylight at your destination as soon as possible to reset your body clock.",
    jetlag_tip_3: "Use caffeine strategically to stay alert during destination daytime — avoid it close to bedtime.",
    jetlag_tip_4: "Short naps (20-30 minutes) can help, but avoid long naps that disrupt nighttime sleep.",
    jetlag_tip_5: "Eat meals aligned with your destination's local time as soon as possible.",
    premium_title: "Premium Feature",
    premium_msg: "You've used your free pairing. Upgrade to continue.",
    upgrade: "Upgrade to Premium",
    free_trial: "First Pairing Free",
    calorie_title: "Calorie Estimator",
    calorie_placeholder: "Describe what you ate (e.g. chicken sandwich, coffee with milk)...",
    calorie_btn: "Estimate Calories",
    airplane_meal_title: "Check Airplane Meal",
    airplane_meal_placeholder: "Describe the meal you were served on the plane...",
    airplane_meal_btn: "Check Meal",
    airplane_meal_error: "Could not check this meal. Please try again.",
    fits_yes: "Fits your diet",
    fits_no: "Doesn't fit your diet",
    fits_partial: "Partially fits your diet",
    tab_plan: "Meal Plan",
    tab_grocery: "Grocery List",
    tab_restrictions: "Food Rules",
    tab_nearby: "Nearby",
    nearby_groceries: "Grocery Stores",
    nearby_restaurants: "Healthy Restaurants",
    nearby_premium_title: "Premium Feature",
    nearby_premium_msg: "Upgrade to Premium to see nearby grocery stores and restaurants at your destination.",
    nearby_loading: "Finding places near you…",
    nearby_error: "Could not load nearby places. Try again later.",
    nearby_open: "Open now",
    nearby_closed: "Closed",
    new_pairing: "New Pairing",
    view_last_plan: "View Last Plan",
    saved_meals_title: "Saved Meals",
    saved_meals_empty: "No saved meals yet. Tap the heart on any meal to save it here.",
    welcome_back: "Welcome back",
    profile_title: "Edit Profile",
    profile_locked_note: "Name and email can't be changed here.",
    save_profile: "Save Changes",
    disclaimer_title: "Disclaimer",
    disclaimer_text: "NutriCrew plans are generated by AI and are for informational purposes only. We are not licensed nutritionists or dietitians. Please consult a qualified healthcare professional before making significant changes to your diet.",
    calorie_disclaimer: "Estimates only — not medical advice.",
    plan_loading: "Preparing your nutrition plan...",
    plan_error: "Could not generate plan. Please try again.",
    calorie_error: "Could not estimate calories. Please try again.",
    step_calorie_target: "Calorie Target",
    calorie_target_based_on: "Based on your weight: {weight}",
    calorie_target_tdee: "Estimated maintenance calories: ~{tdee} kcal/day",
    calorie_target_select: "Choose your deficit level:",
    deficit_gentle: "Gentle (−250 kcal/day) — lose ~0.25 kg/week",
    deficit_moderate: "Moderate (−500 kcal/day) — lose ~0.5 kg/week ⭐",
    deficit_aggressive: "Aggressive (−750 kcal/day) — lose ~0.75 kg/week",
    deficit_custom: "Custom target",
    calorie_target_result: "Your daily target",
    calorie_target_custom_label: "Daily calorie target (kcal)",
    calorie_target_custom_error_low: "Minimum is 1,200 kcal/day for safety.",
    calorie_target_custom_error_high: "Must be below your maintenance minus 100 kcal (max {max} kcal).",
    calorie_target_disclaimer: "Estimates only. Consult a healthcare professional before starting a calorie deficit.",
  },
  fr: {
    tagline: "Alimentez Votre Vol",
    tagline_sub: "Nutrition, décalage horaire et planification des repas pour le personnel de cabine",
    start: "Commencer l'Enregistrement",
    step_lang: "Choisir la Langue",
    step_name: "Nom Complet",
    step_email: "Adresse Email",
    step_gender: "Genre",
    step_weight: "Poids",
    step_age: "Votre Âge",
    step_position: "Votre Rôle",
    step_pairing: "Durée du Pairing",
    step_route: "Votre Route",
    destination_label: "Destination",
    step_usa: "Vol vers les États-Unis?",
    step_kitchen: "Accès Cuisine",
    step_diet: "Votre Alimentation",
    step_goals: "Vos Objectifs",
    step_budget: "Votre Budget",
    continue: "Continuer →",
    back: "← Retour",
    generate: "Générer Mon Plan",
    boarding_title: "CARTE D'EMBARQUEMENT",
    day: "Jour", days: "Jours",
    male: "Homme", female: "Femme", other: "Autre / Préfère ne pas dire",
    pilot: "Pilote", cabin: "Personnel Navigant", mechanic: "Mécanicien",
    ground: "Personnel Au Sol", atc: "Contrôleur Aérien", dispatch: "Répartiteur", other_role: "Autre",
    yes: "Oui", no: "Non",
    full_kitchen: "Cuisine Complète", hotel_no_kitchen: "Hôtel (Sans Cuisine)",
    microwave: "Micro-ondes Seulement", airplane_food: "Repas Avion Fournis",
    no_restrictions: "Sans Restrictions", vegetarian: "Végétarien",
    vegan: "Végétalien", gluten_free: "Sans Gluten", halal: "Halal",
    kosher: "Casher", low_carb: "Faible en Glucides",
    dairy_free: "Sans Produits Laitiers", mediterranean: "Méditerranéen", carnivore: "Carnivore",
    calorie_deficit: "Déficit Calorique ⭐",
    diet_other: "Autre", diet_other_placeholder: "Décrivez votre alimentation...",
    lose_weight: "Perdre du Poids", keep_weight: "Maintenir le Poids",
    stay_focused: "Rester Concentré", no_bloating: "Éviter les Ballonnements",
    energy: "Énergie Soutenue", muscle: "Maintenir la Masse Musculaire", sleep: "Meilleur Sommeil",
    budget_day: "Par Jour", budget_total: "Pairing Total",
    kg: "kg", lbs: "lbs",
    hours_diff: "Heures de différence",
    jetlag_note: "Décalage détecté — repas ajustés pour votre rythme circadien",
    jetlag_title: "Contrôle du Décalage Horaire",
    jetlag_advisory: "Alerte Décalage Horaire",
    jetlag_diff_label: "Décalage horaire",
    jetlag_hours: "heures",
    jetlag_ahead: "en avance",
    jetlag_behind: "en retard",
    jetlag_none_title: "Pas de Décalage Important",
    jetlag_none_text: "Votre trajet présente un décalage de moins de 4 heures — votre horloge interne ne devrait pas avoir besoin d'ajustements majeurs. Restez hydraté et gardez un horaire de repas régulier.",
    jetlag_eastward_title: "Avancez Votre Horloge Interne",
    jetlag_eastward_text: "Votre destination est en avance par rapport à votre domicile. Avancez progressivement votre sommeil et vos repas avant le départ si possible, et exposez-vous à la lumière du matin à destination.",
    jetlag_westward_title: "Retardez Votre Horloge Interne",
    jetlag_westward_text: "Votre destination est en retard par rapport à votre domicile. Couchez-vous plus tard et retardez progressivement vos repas et votre sommeil, et exposez-vous à la lumière du soir à destination.",
    jetlag_tips_title: "Conseils Généraux",
    jetlag_tip_1: "Restez hydraté — buvez beaucoup d'eau et limitez l'alcool et la caféine pendant le vol.",
    jetlag_tip_2: "Exposez-vous à la lumière naturelle à destination dès que possible pour réinitialiser votre horloge interne.",
    jetlag_tip_3: "Utilisez la caféine stratégiquement pour rester alerte pendant la journée à destination — évitez-la avant de dormir.",
    jetlag_tip_4: "De courtes siestes (20-30 minutes) peuvent aider, mais évitez les longues siestes qui perturbent le sommeil nocturne.",
    jetlag_tip_5: "Mangez selon l'heure locale de votre destination dès que possible.",
    premium_title: "Fonctionnalité Premium",
    premium_msg: "Vous avez utilisé votre pairing gratuit. Passez au Premium.",
    upgrade: "Passer au Premium",
    free_trial: "Premier Pairing Gratuit",
    calorie_title: "Estimateur de Calories",
    calorie_placeholder: "Décrivez ce que vous avez mangé...",
    calorie_btn: "Estimer les Calories",
    airplane_meal_title: "Vérifier le Repas à Bord",
    airplane_meal_placeholder: "Décrivez le repas qui vous a été servi dans l'avion...",
    airplane_meal_btn: "Vérifier",
    airplane_meal_error: "Impossible de vérifier ce repas. Veuillez réessayer.",
    fits_yes: "Convient à votre alimentation",
    fits_no: "Ne convient pas à votre alimentation",
    fits_partial: "Convient partiellement à votre alimentation",
    tab_plan: "Plan Repas",
    tab_grocery: "Liste de Courses",
    tab_restrictions: "Règles Alimentaires",
    tab_nearby: "À Proximité",
    nearby_groceries: "Épiceries",
    nearby_restaurants: "Restaurants Sains",
    nearby_premium_title: "Fonctionnalité Premium",
    nearby_premium_msg: "Passez au Premium pour voir les épiceries et restaurants sains près de votre destination.",
    nearby_loading: "Recherche de lieux à proximité…",
    nearby_error: "Impossible de charger les lieux. Réessayez plus tard.",
    nearby_open: "Ouvert maintenant",
    nearby_closed: "Fermé",
    new_pairing: "Nouveau Pairing",
    view_last_plan: "Voir le Dernier Plan",
    saved_meals_title: "Repas Enregistrés",
    saved_meals_empty: "Aucun repas enregistré. Touchez le cœur sur un repas pour l'enregistrer ici.",
    welcome_back: "Bon retour",
    profile_title: "Modifier le Profil",
    profile_locked_note: "Le nom et l'email ne peuvent pas être modifiés ici.",
    save_profile: "Enregistrer",
    disclaimer_title: "Avertissement",
    disclaimer_text: "Les plans NutriCrew sont générés par IA et sont fournis à titre informatif uniquement. Nous ne sommes pas des nutritionnistes ou diététiciens agréés. Consultez un professionnel de santé qualifié avant d'apporter des changements importants à votre alimentation.",
    calorie_disclaimer: "Estimations seulement — pas un avis médical.",
    plan_loading: "Préparation de votre plan nutritionnel...",
    plan_error: "Impossible de générer le plan. Veuillez réessayer.",
    calorie_error: "Impossible d'estimer les calories. Veuillez réessayer.",
    step_calorie_target: "Objectif Calorique",
    calorie_target_based_on: "Basé sur votre poids : {weight}",
    calorie_target_tdee: "Calories d'entretien estimées : ~{tdee} kcal/jour",
    calorie_target_select: "Choisissez votre niveau de déficit :",
    deficit_gentle: "Doux (−250 kcal/jour) — perdre ~0,25 kg/semaine",
    deficit_moderate: "Modéré (−500 kcal/jour) — perdre ~0,5 kg/semaine ⭐",
    deficit_aggressive: "Intensif (−750 kcal/jour) — perdre ~0,75 kg/semaine",
    deficit_custom: "Cible personnalisée",
    calorie_target_result: "Votre objectif journalier",
    calorie_target_custom_label: "Objectif calorique journalier (kcal)",
    calorie_target_custom_error_low: "Le minimum est 1 200 kcal/jour pour votre sécurité.",
    calorie_target_custom_error_high: "Doit être inférieur à votre entretien moins 100 kcal (max {max} kcal).",
    calorie_target_disclaimer: "Estimations uniquement. Consultez un professionnel de santé avant de commencer un déficit calorique.",
  },
  es: {
    tagline: "Combustible Para Tu Vuelo",
    tagline_sub: "Nutrición, jet lag y planificación de comidas para tripulaciones de vuelo",
    start: "Comenzar Check-In",
    step_lang: "Seleccionar Idioma",
    step_name: "Nombre Completo",
    step_email: "Correo Electrónico",
    step_gender: "Género",
    step_weight: "Peso",
    step_age: "Tu Edad",
    step_position: "Tu Rol",
    step_pairing: "Duración del Pairing",
    step_route: "Tu Ruta",
    destination_label: "Destino",
    step_usa: "¿Vuelo a EE.UU.?",
    step_kitchen: "Acceso a Cocina",
    step_diet: "Tu Dieta",
    step_goals: "Tus Objetivos",
    step_budget: "Tu Presupuesto",
    continue: "Continuar →",
    back: "← Atrás",
    generate: "Generar Mi Plan",
    boarding_title: "TARJETA DE EMBARQUE",
    day: "Día", days: "Días",
    male: "Masculino", female: "Femenino", other: "Otro / Prefiero no decir",
    pilot: "Piloto", cabin: "Tripulación de Cabina", mechanic: "Mecánico",
    ground: "Personal de Tierra", atc: "Control de Tráfico Aéreo", dispatch: "Despachador", other_role: "Otro",
    yes: "Sí", no: "No",
    full_kitchen: "Cocina Completa en Casa", hotel_no_kitchen: "Hotel (Sin Cocina)",
    microwave: "Solo Microondas", airplane_food: "Comida de Avión Incluida",
    no_restrictions: "Sin Restricciones", vegetarian: "Vegetariano",
    vegan: "Vegano", gluten_free: "Sin Gluten", halal: "Halal",
    kosher: "Kosher", low_carb: "Bajo en Carbohidratos",
    dairy_free: "Sin Lácteos", mediterranean: "Mediterráneo", carnivore: "Carnívoro",
    calorie_deficit: "Déficit Calórico ⭐",
    diet_other: "Otra", diet_other_placeholder: "Cuéntanos sobre tu dieta...",
    lose_weight: "Perder Peso", keep_weight: "Mantener Peso",
    stay_focused: "Mantener Concentración", no_bloating: "Evitar Hinchazón",
    energy: "Energía Sostenida", muscle: "Mantener Músculo", sleep: "Mejor Sueño",
    budget_day: "Por Día", budget_total: "Pairing Completo",
    kg: "kg", lbs: "lbs",
    hours_diff: "Horas de diferencia",
    jetlag_note: "Jet lag detectado — comidas ajustadas para tu ritmo circadiano",
    jetlag_title: "Control del Jet Lag",
    jetlag_advisory: "Aviso de Jet Lag",
    jetlag_diff_label: "Diferencia horaria",
    jetlag_hours: "horas",
    jetlag_ahead: "adelante",
    jetlag_behind: "atrás",
    jetlag_none_title: "Sin Jet Lag Significativo",
    jetlag_none_text: "Tu ruta tiene una diferencia horaria menor a 4 horas — tu reloj interno no debería necesitar ajustes importantes. Mantente hidratado y conserva un horario de comidas regular.",
    jetlag_eastward_title: "Adelanta tu Reloj Interno",
    jetlag_eastward_text: "Tu destino está adelantado respecto a tu hogar. Adelanta gradualmente tu sueño y comidas antes de la salida si es posible, y busca luz natural por la mañana en tu destino.",
    jetlag_westward_title: "Retrasa tu Reloj Interno",
    jetlag_westward_text: "Tu destino está atrasado respecto a tu hogar. Acuéstate más tarde y retrasa gradualmente tus comidas y sueño, y busca luz natural por la noche en tu destino.",
    jetlag_tips_title: "Consejos Generales",
    jetlag_tip_1: "Mantente hidratado — bebe mucha agua y limita el alcohol y la cafeína durante el vuelo.",
    jetlag_tip_2: "Recibe luz natural en tu destino lo antes posible para reiniciar tu reloj interno.",
    jetlag_tip_3: "Usa la cafeína estratégicamente para mantenerte alerta durante el día en tu destino — evítala antes de dormir.",
    jetlag_tip_4: "Las siestas cortas (20-30 minutos) pueden ayudar, pero evita siestas largas que alteren el sueño nocturno.",
    jetlag_tip_5: "Come según la hora local de tu destino lo antes posible.",
    premium_title: "Función Premium",
    premium_msg: "Usaste tu pairing gratuito. Actualiza para continuar.",
    upgrade: "Actualizar a Premium",
    free_trial: "Primer Pairing Gratis",
    calorie_title: "Estimador de Calorías",
    calorie_placeholder: "Describe lo que comiste (ej: sándwich de pollo, café con leche)...",
    calorie_btn: "Estimar Calorías",
    airplane_meal_title: "Revisar Comida del Avión",
    airplane_meal_placeholder: "Describe la comida que te sirvieron en el avión...",
    airplane_meal_btn: "Revisar",
    airplane_meal_error: "No se pudo revisar esta comida. Inténtalo de nuevo.",
    fits_yes: "Se ajusta a tu dieta",
    fits_no: "No se ajusta a tu dieta",
    fits_partial: "Se ajusta parcialmente a tu dieta",
    tab_plan: "Plan de Comidas",
    tab_grocery: "Lista de Compras",
    tab_restrictions: "Reglas Alimentarias",
    tab_nearby: "Cercano",
    nearby_groceries: "Tiendas de Comestibles",
    nearby_restaurants: "Restaurantes Saludables",
    nearby_premium_title: "Función Premium",
    nearby_premium_msg: "Actualiza a Premium para ver tiendas y restaurantes saludables cerca de tu destino.",
    nearby_loading: "Buscando lugares cercanos…",
    nearby_error: "No se pudieron cargar los lugares. Inténtalo más tarde.",
    nearby_open: "Abierto ahora",
    nearby_closed: "Cerrado",
    new_pairing: "Nuevo Pairing",
    view_last_plan: "Ver Último Plan",
    saved_meals_title: "Comidas Guardadas",
    saved_meals_empty: "Aún no hay comidas guardadas. Toca el corazón en cualquier comida para guardarla aquí.",
    welcome_back: "Bienvenido de vuelta",
    profile_title: "Editar Perfil",
    profile_locked_note: "El nombre y el correo no se pueden cambiar aquí.",
    save_profile: "Guardar Cambios",
    disclaimer_title: "Aviso Legal",
    disclaimer_text: "Los planes de NutriCrew son generados por IA y son solo para fines informativos. No somos nutricionistas ni dietistas certificados. Consulta a un profesional de la salud calificado antes de hacer cambios importantes en tu dieta.",
    calorie_disclaimer: "Solo estimaciones — no es un consejo médico.",
    plan_loading: "Preparando tu plan nutricional...",
    plan_error: "No se pudo generar el plan. Inténtalo de nuevo.",
    calorie_error: "No se pudieron estimar las calorías. Inténtalo de nuevo.",
    step_calorie_target: "Objetivo Calórico",
    calorie_target_based_on: "Basado en tu peso: {weight}",
    calorie_target_tdee: "Calorías de mantenimiento estimadas: ~{tdee} kcal/día",
    calorie_target_select: "Elige tu nivel de déficit:",
    deficit_gentle: "Suave (−250 kcal/día) — perder ~0,25 kg/semana",
    deficit_moderate: "Moderado (−500 kcal/día) — perder ~0,5 kg/semana ⭐",
    deficit_aggressive: "Agresivo (−750 kcal/día) — perder ~0,75 kg/semana",
    deficit_custom: "Objetivo personalizado",
    calorie_target_result: "Tu objetivo diario",
    calorie_target_custom_label: "Objetivo calórico diario (kcal)",
    calorie_target_custom_error_low: "El mínimo es 1.200 kcal/día por seguridad.",
    calorie_target_custom_error_high: "Debe ser inferior a tu mantenimiento menos 100 kcal (máx. {max} kcal).",
    calorie_target_disclaimer: "Solo estimaciones. Consulta a un profesional de salud antes de comenzar un déficit calórico.",
  }
};

// ─── TIMEZONE LOOKUP (standard time, no DST) ──────────────────────
const AIRPORT_UTC_OFFSET = {
  // Canada
  YYZ:-5, YUL:-5, YOW:-5, YHZ:-4, YQB:-5, YQM:-4, YFC:-4, YSJ:-4, YYG:-4,
  YWG:-6, YYC:-7, YEG:-7, YVR:-8, YYJ:-8, YXE:-6, YQR:-6,
  // USA
  JFK:-5, LGA:-5, EWR:-5, BOS:-5, PHL:-5, IAD:-5, DCA:-5, BWI:-5,
  ORD:-6, MDW:-6, DTW:-5, MSP:-6, ATL:-5, MIA:-5, FLL:-5, MCO:-5, TPA:-5, RSW:-5,
  DFW:-6, IAH:-6, AUS:-6, DEN:-7, PHX:-7, LAS:-8, LAX:-8, SAN:-8, SFO:-8, SEA:-8, SJC:-8, OAK:-8,
  // Caribbean / Mexico / Central America
  NAS:-5, MBJ:-5, KIN:-5, PUJ:-4, SJU:-4, AUA:-4, BGI:-4, HAV:-5, CUN:-5, MEX:-6, PTY:-5,
  // South America
  GRU:-3, GIG:-3, EZE:-3, BOG:-5, LIM:-5, SCL:-4, UIO:-5,
  // UK / Ireland
  LHR:0, LGW:0, LCY:0, STN:0, LTN:0, DUB:0,
  // Europe
  CDG:1, ORY:1, AMS:1, FRA:1, MUC:1, BER:1, MAD:1, BCN:1, FCO:1, MXP:1, VCE:1,
  ZRH:1, GVA:1, VIE:1, BRU:1, CPH:1, ARN:1, OSL:1, LIS:0, ATH:2, IST:3, WAW:1, PRG:1, BUD:1,
  // Middle East / Africa
  DXB:4, AUH:4, DOH:3, TLV:2, CAI:2, JNB:2, NBO:3, CMN:0,
  // Asia / Pacific
  NRT:9, HND:9, ICN:9, PEK:8, PVG:8, HKG:8, SIN:8, BKK:7, KUL:8, DEL:5.5, BOM:5.5,
  SYD:10, MEL:10, BNE:10, PER:8, AKL:12,
};

function getAirportUtcOffset(text) {
  const match = (text || "").match(/\(([A-Za-z]{3})\)/);
  if (!match) return null;
  const code = match[1].toUpperCase();
  return code in AIRPORT_UTC_OFFSET ? AIRPORT_UTC_OFFSET[code] : null;
}

function computeTimezoneDiff(departure, destinations) {
  const depOffset = getAirportUtcOffset(departure);
  if (depOffset === null) return null;
  const diffs = (destinations || [])
    .map(getAirportUtcOffset)
    .filter(o => o !== null)
    .map(o => {
      let d = o - depOffset;
      if (d > 12) d -= 24;
      if (d < -12) d += 24;
      return d;
    });
  if (diffs.length === 0) return null;
  const worst = diffs.reduce((best, d) => Math.abs(d) > Math.abs(best) ? d : best, diffs[0]);
  return Math.round(worst);
}

const RunwaySVG = () => (
  <svg width="280" height="60" viewBox="0 0 280 60" fill="none" style={{margin:"20px auto",display:"block"}}>
    {/* Perspective runway */}
    {/* Side edges */}
    <line x1="60" y1="0" x2="0" y2="60" stroke={C.gold} strokeWidth="1.5" opacity="0.7"/>
    <line x1="220" y1="0" x2="280" y2="60" stroke={C.gold} strokeWidth="1.5" opacity="0.7"/>
    {/* Center dashes - perspective scaled */}
    <rect x="132" y="2" width="16" height="8" rx="2" fill={C.gold} opacity="0.9"/>
    <rect x="126" y="15" width="28" height="8" rx="2" fill={C.gold} opacity="0.75"/>
    <rect x="118" y="30" width="44" height="9" rx="2" fill={C.gold} opacity="0.55"/>
    <rect x="106" y="46" width="68" height="10" rx="2" fill={C.gold} opacity="0.35"/>
    {/* Side markings */}
    <rect x="72" y="8" width="20" height="5" rx="1" fill={C.navyBorder} opacity="0.6"/>
    <rect x="188" y="8" width="20" height="5" rx="1" fill={C.navyBorder} opacity="0.6"/>
    <rect x="54" y="22" width="28" height="6" rx="1" fill={C.navyBorder} opacity="0.5"/>
    <rect x="198" y="22" width="28" height="6" rx="1" fill={C.navyBorder} opacity="0.5"/>
    {/* Threshold bars */}
    {[-40,-22,-4,14,32].map((x,i) => (
      <rect key={i} x={140+x} y="50" width="14" height="8" rx="1" fill={C.white} opacity={0.12+i*0.04}/>
    ))}
    {/* Glow underneath */}
    <ellipse cx="140" cy="58" rx="80" ry="4" fill={C.gold} opacity="0.08"/>
  </svg>
);

// ─── SVG ICONS ────────────────────────────────────────────────────
const PlaneIcon = ({ size = 24, color = C.white }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill={color}/>
  </svg>
);

const PassportIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="2" width="24" height="28" rx="3" fill={C.navyBorder}/>
    <rect x="4" y="2" width="24" height="28" rx="3" stroke={C.gold} strokeWidth="1.5"/>
    <circle cx="16" cy="13" r="5" stroke={C.gold} strokeWidth="1.2" fill="none"/>
    <path d="M16 8v10M11 13h10" stroke={C.gold} strokeWidth="1"/>
    <rect x="8" y="20" width="16" height="1.5" rx="0.75" fill={C.muted}/>
    <rect x="8" y="23" width="10" height="1.5" rx="0.75" fill={C.muted}/>
  </svg>
);

const CalorieIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M11 2C6.5 2 3 5.5 3 10c0 5 8 12 8 12s8-7 8-12c0-4.5-3.5-8-8-8z" stroke={C.gold} strokeWidth="1.5" fill="none"/>
    <path d="M11 7v4l3 3" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const JetlagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="8" stroke={C.gold} strokeWidth="1.5" fill="none"/>
    <path d="M11 6.5v4.5l3 2" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 2v1.5M11 19.5V21M2 11h1.5M18.5 11H20" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SavedMealsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M11 19s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 18 9c0 5.6-7 10-7 10z" stroke={C.gold} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="9" stroke={C.gold} strokeWidth="1.5" fill="none"/>
    <circle cx="11" cy="9" r="2.6" stroke={C.gold} strokeWidth="1.5" fill="none"/>
    <path d="M5.5 17c0.8-2.6 3-4 5.5-4s4.7 1.4 5.5 4" stroke={C.gold} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
);

// ─── HELPERS ──────────────────────────────────────────────────────
const storage = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

const PAIRING_COUNT_KEY = "nutricrew_pairing_count";
const FAVORITES_KEY = "nutricrew_favorites";
const USER_KEY = "nutricrew_user";
const SAVED_PLANS_KEY = "nutricrew_saved_plans";
const MAX_SAVED_PLANS = 10;

// Generated plans are cached by their exact input parameters (and language),
// so re-submitting the same pairing reuses the saved result instead of
// calling the AI backend again.
function planCacheKey(data, lang) {
  const sorted = {};
  Object.keys(data).sort().forEach(k => { sorted[k] = data[k]; });
  return `${lang}|${JSON.stringify(sorted)}`;
}

function getSavedPlans() {
  return storage.get(SAVED_PLANS_KEY) || [];
}

function saveSavedPlan(key, data, plan) {
  const next = [{ key, data, plan, createdAt: Date.now() }, ...getSavedPlans().filter(p => p.key !== key)].slice(0, MAX_SAVED_PLANS);
  storage.set(SAVED_PLANS_KEY, next);
}

function findSavedPlan(key) {
  return getSavedPlans().find(p => p.key === key);
}

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function NutriCrew() {
  const [user, setUser] = useState(() => storage.get(USER_KEY));
  const [lang, setLang] = useState(() => user?.lang || "en");
  const [screen, setScreen] = useState("splash"); // splash | checkin | passport | boarding | plan | premium
  const [step, setStep] = useState(0);
  const [pairing, setPairing] = useState({});
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("plan");
  const [activeDay, setActiveDay] = useState(0);
  const [showCalorie, setShowCalorie] = useState(false);
  const [calorieText, setCalorieText] = useState("");
  const [calorieResult, setCalorieResult] = useState(null);
  const [calorieLoading, setCalorieLoading] = useState(false);
  const [showAirplaneMeal, setShowAirplaneMeal] = useState(false);
  const [airplaneMealText, setAirplaneMealText] = useState("");
  const [airplaneMealResult, setAirplaneMealResult] = useState(null);
  const [airplaneMealLoading, setAirplaneMealLoading] = useState(false);
  const [showJetlag, setShowJetlag] = useState(false);
  const [showSavedMeals, setShowSavedMeals] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [favorites, setFavorites] = useState(() => storage.get(FAVORITES_KEY) || []);
  const [returningUser] = useState(() => !!user);

  const t = T[lang];

  const FREE_PAIRING_LIMIT = 1;
  const pairingCount = storage.get(PAIRING_COUNT_KEY) || 0;
  const isPremiumNeeded = pairingCount >= FREE_PAIRING_LIMIT;

  // Detect successful Stripe return (?premium=true in URL)
  const [premiumSuccess, setPremiumSuccess] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("premium") === "true") {
      window.history.replaceState({}, "", window.location.pathname);
      return true;
    }
    return false;
  });

  // ── STEP DEFINITIONS (check-in flow) ──────────────────────────
  // If returning user, skip personal steps.
  // Calorie Deficit diet injects an extra step to collect the calorie target.
  const allSteps = [
    "name", "email", "gender", "weight", "age", "position",
    "pairing_days", "departure", "destination", "going_usa",
    "kitchen", "diet",
    ...((pairing.diets || []).includes("calorie_deficit") ? ["calorie_target"] : []),
    "goals", "budget"
  ];
  const personalSteps = ["name","email","gender","weight","age","position"];
  const steps = returningUser
    ? allSteps.filter(s => !personalSteps.includes(s))
    : allSteps;

  const currentStep = steps[step];
  const totalSteps = steps.length;

  const upd = (k, v) => setPairing(p => ({ ...p, [k]: v }));

  const handleUpgrade = async () => {
    const email = user?.email || pairing?.email;
    if (!email) return;
    try {
      const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // silently fall through — button stays clickable
    }
  };

  const handleContinue = () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      // Show boarding pass before generating
      setScreen("boarding");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleGenerate = async () => {
    if (isPremiumNeeded) { setScreen("premium"); return; }
    setScreen("plan");

    const data = { ...user, ...pairing };
    const cacheKey = planCacheKey(data, lang);
    const cached = findSavedPlan(cacheKey);
    if (cached) {
      setPlan(cached.plan);
      return;
    }

    setLoading(true);
    try {
      const result = await generatePlan(data, lang);
      setPlan(result);
      saveSavedPlan(cacheKey, data, result);
      storage.set(PAIRING_COUNT_KEY, result.pairingCount ?? pairingCount + 1);
    } catch (e) {
      if (e.code === "premium_required") {
        storage.set(PAIRING_COUNT_KEY, e.pairingCount ?? FREE_PAIRING_LIMIT);
        setScreen("premium");
      } else {
        setPlan({ error: true });
      }
    }
    setLoading(false);
  };

  const handleEstimateCalories = async () => {
    if (!calorieText.trim()) return;
    setCalorieLoading(true);
    try {
      const r = await estimateCalories(calorieText, lang);
      setCalorieResult(r);
    } catch { setCalorieResult({ error: true }); }
    setCalorieLoading(false);
  };

  const handleCheckAirplaneMeal = async () => {
    if (!airplaneMealText.trim()) return;
    setAirplaneMealLoading(true);
    try {
      const r = await checkAirplaneMeal(airplaneMealText, pairing.diets || (pairing.diet ? [pairing.diet] : []), pairing.diet_other, lang);
      setAirplaneMealResult(r);
    } catch { setAirplaneMealResult({ error: true }); }
    setAirplaneMealLoading(false);
  };

  const toggleFavorite = (meal) => {
    const id = `${meal.type}-${meal.name}`;
    setFavorites(prev => {
      const exists = prev.some(f => f.id === id);
      const next = exists ? prev.filter(f => f.id !== id) : [...prev, { ...meal, id }];
      storage.set(FAVORITES_KEY, next);
      return next;
    });
  };

  const updateProfile = (changes) => {
    const updated = { ...(user || {}), ...changes };
    storage.set(USER_KEY, updated);
    setUser(updated);
  };

  const startNewPairing = () => {
    setPairing({});
    setPlan(null);
    setStep(0);
    setActiveTab("plan");
    setActiveDay(0);
    setScreen("checkin");
  };

  const viewLastPlan = () => {
    const last = getSavedPlans()[0];
    if (!last) return;
    setPairing(last.data);
    setPlan(last.plan);
    setActiveTab("plan");
    setActiveDay(0);
    setScreen("plan");
  };

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div style={styles.root}>
      {/* Background grid lines (aviation aesthetic) */}
      <div style={styles.gridOverlay}/>

      {screen === "splash" && (
        <SplashScreen t={t} lang={lang} setLang={setLang}
          returningUser={returningUser} user={user}
          hasSavedPlan={getSavedPlans().length > 0}
          onStart={() => setScreen("checkin")}
          onNewPairing={startNewPairing}
          onViewLastPlan={viewLastPlan}
          onOpenSavedMeals={() => setShowSavedMeals(true)}
          onOpenProfile={() => setShowProfile(true)}
        />
      )}

      {screen === "checkin" && (
        <CheckInScreen
          t={t} lang={lang} step={step} totalSteps={totalSteps}
          currentStep={currentStep} pairing={pairing} user={user}
          upd={upd} onContinue={handleContinue} onBack={handleBack}
          setUser={setUser}
        />
      )}

      {screen === "boarding" && (
        <BoardingPassScreen t={t} user={user} pairing={pairing}
          onGenerate={handleGenerate} onBack={() => setScreen("checkin")}
          isPremiumNeeded={isPremiumNeeded}
        />
      )}

      {screen === "plan" && (
        <PlanScreen
          t={t} plan={plan} loading={loading} pairing={pairing}
          user={user} activeTab={activeTab} setActiveTab={setActiveTab}
          activeDay={activeDay} setActiveDay={setActiveDay}
          onNewPairing={startNewPairing} lang={lang}
          favorites={favorites} onToggleFavorite={toggleFavorite}
          onOpenAirplaneMeal={() => setShowAirplaneMeal(true)}
          isPremium={plan?.isPremium ?? false}
        />
      )}

      {screen === "premium" && (
        <PremiumScreen t={t} onBack={() => setScreen("boarding")} onUpgrade={handleUpgrade} premiumSuccess={premiumSuccess}/>
      )}

      {/* Floating calorie button */}
      {(screen === "plan" || screen === "boarding") && (
        <>
          <button style={styles.floatBtn} onClick={() => setShowCalorie(true)} aria-label="calorie estimator">
            <CalorieIcon/>
          </button>
          {showCalorie && (
            <CalorieModal
              t={t}
              text={calorieText} setText={setCalorieText}
              result={calorieResult} loading={calorieLoading}
              onEstimate={handleEstimateCalories}
              onClose={() => { setShowCalorie(false); setCalorieResult(null); setCalorieText(""); }}
            />
          )}
          <button style={styles.floatBtnJetlag} onClick={() => setShowJetlag(true)} aria-label="jet lag info">
            <JetlagIcon/>
          </button>
          {showJetlag && (
            <JetlagModal
              t={t}
              pairing={pairing}
              onClose={() => setShowJetlag(false)}
            />
          )}
          <button style={styles.floatBtnSaved} onClick={() => setShowSavedMeals(true)} aria-label="saved meals">
            <SavedMealsIcon/>
          </button>
        </>
      )}

      {showAirplaneMeal && (
        <AirplaneMealModal
          t={t}
          text={airplaneMealText} setText={setAirplaneMealText}
          result={airplaneMealResult} loading={airplaneMealLoading}
          onCheck={handleCheckAirplaneMeal}
          onClose={() => { setShowAirplaneMeal(false); setAirplaneMealResult(null); setAirplaneMealText(""); }}
        />
      )}

      {showSavedMeals && (
        <SavedMealsModal
          t={t}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onClose={() => setShowSavedMeals(false)}
        />
      )}

      {showProfile && (
        <ProfileModal
          t={t}
          user={user}
          onSave={updateProfile}
          onClose={() => setShowProfile(false)}
        />
      )}

      <style>{globalCSS}</style>
    </div>
  );
}

// ─── SPLASH SCREEN ────────────────────────────────────────────────
function SplashScreen({ t, lang, setLang, returningUser, user, hasSavedPlan, onStart, onNewPairing, onViewLastPlan, onOpenSavedMeals, onOpenProfile }) {
  return (
    <div style={styles.splash}>
      {returningUser && user && (
        <button style={styles.profileBtn} onClick={onOpenProfile} aria-label="profile">
          <ProfileIcon/>
        </button>
      )}
      <div style={styles.splashInner}>
        {/* Language selector */}
        <div style={styles.langRow}>
          {["en","fr","es"].map(l => (
            <button key={l} style={{...styles.langBtn, ...(lang===l ? styles.langBtnActive : {})}}
              onClick={() => setLang(l)}>
              {l === "en" ? "🇬🇧 EN" : l === "fr" ? "🇫🇷 FR" : "🇪🇸 ES"}
            </button>
          ))}
        </div>

        {/* Logo area */}
        <div style={styles.logoArea}>
          <div style={styles.logoImgWrap}>
            <img src="data:image/jpeg;base64,/9j/4Q/+RXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAZgAAAAAAAABIAAAAAQAAAEgAAAABAAeQAAAHAAAABDAyMjGRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAB4CgAwAEAAAAAQAAB4CkBgADAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" alt="NutriCrew" style={styles.logoImg}/>
            <div style={styles.logoGlow}/>
          </div>
          <div style={styles.appName}>NutriCrew</div>
          <div style={styles.appTagline}>{t.tagline}</div>
          <div style={styles.appTaglineSub}>{t.tagline_sub}</div>
        </div>

        {/* Runway */}
        <RunwaySVG/>

        {returningUser && user ? (
          <div style={styles.welcomeBack}>
            <div style={styles.wbTitle}>{t.welcome_back}, {user.name?.split(" ")[0]}!</div>
            <button style={styles.primaryBtn} onClick={onNewPairing}>
              <PlaneIcon size={16} color={C.navy}/> {t.new_pairing}
            </button>
            {hasSavedPlan && (
              <button style={styles.secondaryBtn} onClick={onViewLastPlan}>
                {t.view_last_plan}
              </button>
            )}
            <button style={styles.secondaryBtn} onClick={onOpenSavedMeals}>
              {t.saved_meals_title}
            </button>
          </div>
        ) : (
          <div>
            <div style={styles.freeTrialBadge}>⭐ {t.free_trial}</div>
            <button style={styles.primaryBtn} onClick={onStart}>
              {t.start}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CHECK-IN SCREEN ──────────────────────────────────────────────
function CheckInScreen({ t, lang, step, totalSteps, currentStep, pairing, user, upd, onContinue, onBack, setUser }) {
  const [localVal, setLocalVal] = useState(() => pairing[currentStep] ?? user?.[currentStep] ?? "");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [prevStep, setPrevStep] = useState(currentStep);
  const [docNumber] = useState(() => Date.now().toString());

  if (currentStep !== prevStep) {
    setPrevStep(currentStep);
    setLocalVal(pairing[currentStep] ?? user?.[currentStep] ?? "");
  }

  const save = (v) => {
    upd(currentStep, v);
    if (["name","email","gender","weight","position"].includes(currentStep)) {
      const updated = { ...(user || {}), [currentStep]: v, lang };
      storage.set(USER_KEY, updated);
      setUser(updated);
    }
  };

  const canContinue = () => {
    if (currentStep === "budget") return !!(pairing.budget_type && pairing.budget_amount);
    if (currentStep === "destination") {
      const numDays = pairing.pairing_days || 1;
      const dests = pairing.destinations || [];
      return dests.length >= numDays && dests.slice(0, numDays).every(d => d?.trim());
    }
    const v = pairing[currentStep] ?? user?.[currentStep];
    if (!v) return false;
    if (currentStep === "goals" && (!pairing.goals || pairing.goals.length === 0)) return false;
    if (currentStep === "diet") {
      if (!pairing.diets || pairing.diets.length === 0) return false;
      if (pairing.diets.includes("other") && !pairing.diet_other?.trim()) return false;
      return true;
    }
    if (currentStep === "age") {
      const age = parseInt(pairing.age ?? user?.age, 10);
      return !!(age && age >= 16 && age <= 80);
    }
    return true;
  };

  const progress = ((step + 1) / totalSteps) * 100;

  const stepContent = () => {
    switch (currentStep) {
      case "name":
        return <TextInput label={t.step_name} value={localVal}
          onChange={v => { setLocalVal(v); save(v); }}
          placeholder="John Smith" icon="✈️"/>;

      case "email":
        return <TextInput label={t.step_email} value={localVal} type="email"
          onChange={v => { setLocalVal(v); save(v); }}
          placeholder="john@airline.com" icon="📧"/>;

      case "gender":
        return <RadioGroup label={t.step_gender}
          options={[{v:"male",l:t.male},{v:"female",l:t.female},{v:"other",l:t.other}]}
          value={pairing.gender || user?.gender}
          onChange={v => { upd("gender",v); save(v); }}/>;

      case "age":
        return (
          <div>
            <div style={styles.inputLabel}>{t.step_age}</div>
            <TextInput
              value={String(pairing.age || user?.age || "")}
              type="number"
              onChange={v => { upd("age", v); save(v); }}
              placeholder="e.g. 32"
              icon="🎂"
            />
          </div>
        );

      case "weight":
        return (
          <div>
            <div style={styles.inputLabel}>{t.step_weight}</div>
            <div style={styles.unitToggle}>
              {["kg","lbs"].map(u => (
                <button key={u} style={{...styles.unitBtn, ...(weightUnit===u?styles.unitBtnActive:{})}}
                  onClick={() => setWeightUnit(u)}>{u}</button>
              ))}
            </div>
            <TextInput value={localVal} type="number"
              onChange={v => { setLocalVal(v); save(v + weightUnit); }}
              placeholder={weightUnit === "kg" ? "70" : "154"} icon="⚖️"/>
          </div>
        );

      case "position":
        return <RadioGroup label={t.step_position}
          options={[
            {v:"pilot",l:t.pilot,icon:"🛩️"},
            {v:"cabin",l:t.cabin,icon:"✈️"},
            {v:"mechanic",l:t.mechanic,icon:"🔧"},
            {v:"ground",l:t.ground,icon:"🚧"},
            {v:"atc",l:t.atc,icon:"📡"},
            {v:"dispatch",l:t.dispatch,icon:"📋"},
            {v:"other",l:t.other_role,icon:"👤"},
          ]}
          value={pairing.position || user?.position}
          onChange={v => { upd("position",v); save(v); }}/>;

      case "pairing_days":
        return (
          <div>
            <div style={styles.inputLabel}>{t.step_pairing}</div>
            <div style={styles.daysRow}>
              {[1,2,3,4,5].map(d => (
                <button key={d}
                  style={{...styles.dayBtn, ...(pairing.pairing_days===d?styles.dayBtnActive:{})}}
                  onClick={() => upd("pairing_days", d)}>
                  <span style={styles.dayNum}>{d}</span>
                  <span style={styles.dayLabel}>{t.days}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "departure":
        return <TextInput label={t.step_route + " — " + "Departure"} value={localVal}
          onChange={v => {
            setLocalVal(v);
            upd("departure", v);
            upd("timezone", computeTimezoneDiff(v, pairing.destinations) ?? 0);
          }}
          placeholder="Montreal (YUL)" icon="🛫"/>;

      case "destination": {
        const numDays = pairing.pairing_days || 1;
        const dests = pairing.destinations || [];
        const updDest = (i, v) => {
          const next = [...dests];
          next[i] = v;
          upd("destinations", next);
          upd("timezone", computeTimezoneDiff(pairing.departure, next) ?? 0);
        };
        const tzDiff = computeTimezoneDiff(pairing.departure, dests);
        return (
          <div>
            <div style={styles.inputLabel}>{t.step_route} — {t.destination_label}</div>
            {Array.from({ length: numDays }).map((_, i) => (
              <div key={i} style={{marginBottom: 12}}>
                <div style={styles.hint}>{t.day} {i+1}</div>
                <TextInput value={dests[i] || ""}
                  onChange={v => updDest(i, v)}
                  placeholder="Paris (CDG)" icon="🛬"/>
              </div>
            ))}
            {tzDiff !== null && (
              <div style={styles.hint}>{t.hours_diff}: {tzDiff > 0 ? "+" : ""}{tzDiff}h</div>
            )}
            {tzDiff !== null && Math.abs(tzDiff) >= 4 && (
              <div style={styles.jetlagCard}>
                <span style={{fontSize:18}}>😴</span>
                <span>{t.jetlag_note}</span>
              </div>
            )}
          </div>
        );
      }

      case "going_usa":
        return <RadioGroup label={t.step_usa}
          options={[{v:"yes",l:t.yes,icon:"🇺🇸"},{v:"no",l:t.no,icon:"🌍"}]}
          value={pairing.going_usa}
          onChange={v => upd("going_usa", v)}/>;

      case "kitchen":
        return <CheckGroup label={t.step_kitchen}
          options={[
            {v:"full_kitchen",l:t.full_kitchen,icon:"🏠"},
            {v:"hotel",l:t.hotel_no_kitchen,icon:"🏨"},
            {v:"microwave",l:t.microwave,icon:"📦"},
            {v:"airplane_food",l:t.airplane_food,icon:"✈️"},
          ]}
          values={pairing.kitchen || []}
          onChange={v => upd("kitchen", v)}/>;

      case "diet":
        return (
          <div>
            <CheckGroup label={t.step_diet}
              options={[
                {v:"none",l:t.no_restrictions,icon:"🍽️"},
                {v:"vegetarian",l:t.vegetarian,icon:"🥗"},
                {v:"vegan",l:t.vegan,icon:"🌱"},
                {v:"gluten_free",l:t.gluten_free,icon:"🌾"},
                {v:"halal",l:t.halal,icon:"☪️"},
                {v:"kosher",l:t.kosher,icon:"✡️"},
                {v:"low_carb",l:t.low_carb,icon:"🥑"},
                {v:"dairy_free",l:t.dairy_free,icon:"🥛"},
                {v:"mediterranean",l:t.mediterranean,icon:"🫒"},
                {v:"carnivore",l:t.carnivore,icon:"🥩"},
                {v:"calorie_deficit",l:t.calorie_deficit,icon:"🔥",premium:true},
                {v:"other",l:t.diet_other,icon:"✏️"},
              ]}
              values={pairing.diets || []}
              onChange={v => {
                let next = v;
                if (v.includes("none") && !(pairing.diets || []).includes("none")) {
                  next = ["none"];
                } else if ((pairing.diets || []).includes("none") && v.length > 1) {
                  next = v.filter(d => d !== "none");
                }
                upd("diets", next);
                if (!next.includes("calorie_deficit")) {
                  upd("calorie_target", null);
                  upd("calorie_deficit_amount", null);
                  upd("calorie_deficit_preset", null);
                }
              }}/>
            {(pairing.diets || []).includes("other") && (
              <div style={{marginTop:12}}>
                <TextInput value={pairing.diet_other || ""}
                  onChange={v => upd("diet_other", v)}
                  placeholder={t.diet_other_placeholder} icon="✏️"/>
              </div>
            )}
          </div>
        );

      case "calorie_target":
        return <CalorieTargetStep t={t} pairing={pairing} user={user} upd={upd} />;

      case "goals":
        return <CheckGroup label={t.step_goals}
          options={[
            {v:"lose_weight",l:t.lose_weight,icon:"⚖️"},
            {v:"keep_weight",l:t.keep_weight,icon:"🎯"},
            {v:"stay_focused",l:t.stay_focused,icon:"🧠"},
            {v:"no_bloating",l:t.no_bloating,icon:"💨"},
            {v:"energy",l:t.energy,icon:"⚡"},
            {v:"muscle",l:t.muscle,icon:"💪"},
            {v:"sleep",l:t.sleep,icon:"😴"},
          ]}
          values={pairing.goals || []}
          onChange={v => upd("goals", v)}/>;

      case "budget":
        return (
          <div>
            <div style={styles.inputLabel}>{t.step_budget}</div>
            <div style={styles.unitToggle}>
              {["day","total"].map(u => (
                <button key={u}
                  style={{...styles.unitBtn, ...(pairing.budget_type===u?styles.unitBtnActive:{})}}
                  onClick={() => upd("budget_type", u)}>
                  {u === "day" ? t.budget_day : t.budget_total}
                </button>
              ))}
            </div>
            <TextInput value={pairing.budget_amount || ""} type="number"
              onChange={v => upd("budget_amount", v)}
              placeholder="50" icon="💰"/>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={styles.checkin}>
      {/* Header */}
      <div style={styles.checkinHeader}>
        <div style={styles.checkinHeaderLeft}>
          <PlaneIcon size={18} color={C.gold}/>
          <span style={styles.checkinBrand}>NutriCrew</span>
        </div>
        <div style={styles.stepCounter}>{step+1}/{totalSteps}</div>
      </div>

      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div style={{...styles.progressFill, width: `${progress}%`}}/>
      </div>

      {/* Passport frame */}
      <div style={styles.passportFrame}>
        <div style={styles.passportHeader}>
          <PassportIcon/>
          <div>
            <div style={styles.passportTitle}>NUTRICREW</div>
            <div style={styles.passportSub}>CREW NUTRITION PASSPORT</div>
          </div>
        </div>
        <div style={styles.passportBody}>
          {stepContent()}
        </div>
        <div style={styles.passportMRZ}>
          <div style={styles.mrzLine}>{"P<NCR" + (pairing.name||"<<<<<<<<<").replace(/\s/g,"<").toUpperCase().padEnd(39,"<")}</div>
          <div style={styles.mrzLine}>{"NCR" + docNumber.slice(-9) + "<<<<<<<<<<<<<<<<<<<"}</div>
        </div>
      </div>

      {/* Nav */}
      <div style={styles.navRow}>
        {step > 0 && (
          <button style={styles.backBtn} onClick={handleBack}>{t.back}</button>
        )}
        <button
          style={{...styles.continueBtn, ...(canContinue()?{}:styles.continueBtnDisabled)}}
          disabled={!canContinue()}
          onClick={onContinue}>
          {t.continue}
        </button>
      </div>
    </div>
  );

  function handleBack() { onBack(); }
}

// ─── BOARDING PASS ────────────────────────────────────────────────
function BoardingPassScreen({ t, user, pairing, onGenerate, onBack, isPremiumNeeded }) {
  const mergedUser = { ...(user || {}), ...pairing };
  const allDiets = mergedUser.diets || (mergedUser.diet ? [mergedUser.diet] : []);
  const filteredDiets = allDiets.filter(d => d && d !== "none");
  const dietDisplay = filteredDiets.length === 0 ? "NONE"
    : filteredDiets.map(d => d === "other" ? (mergedUser.diet_other || "OTHER").toUpperCase() : d.replace(/_/g," ").toUpperCase()).join(" + ");
  const dests = pairing.destinations || [];
  const dep = pairing.departure || "—";
  const dst = dests[0] || "—";
  const depCode = dep.match(/\(([A-Z]{3})\)/)?.[1] || dep.slice(0,3).toUpperCase();
  const dstCode = dst.match(/\(([A-Z]{3})\)/)?.[1] || dst.slice(0,3).toUpperCase();
  const [ticketNumber] = useState(() => Date.now().toString());
  const [barcodeHeights] = useState(() => Array.from({ length: 40 }, () => Math.random()*20+20));

  return (
    <div style={styles.boardingWrap}>
      <div style={styles.boardingCard}>
        {/* Airline header */}
        <div style={styles.bpHeader}>
          <div style={styles.bpAirline}>NUTRICREW NUTRITION</div>
          <PlaneIcon size={28} color={C.gold}/>
        </div>

        <div style={styles.bpDividerDash}/>

        {/* Route */}
        <div style={styles.bpRoute}>
          <div style={styles.bpCity}>
            <div style={styles.bpCode}>{depCode}</div>
            <div style={styles.bpCityName}>{dep.replace(/\s*\([A-Z]+\)/,"")}</div>
          </div>
          <div style={styles.bpArrow}>
            <PlaneIcon size={32} color={C.gold}/>
            <div style={styles.bpLine}/>
          </div>
          <div style={styles.bpCity}>
            <div style={styles.bpCode}>{dstCode}</div>
            <div style={styles.bpCityName}>{dst.replace(/\s*\([A-Z]+\)/,"")}</div>
          </div>
        </div>

        <div style={styles.bpDividerDash}/>

        {/* Info grid */}
        <div style={styles.bpGrid}>
          <BPField label="PASSENGER" value={mergedUser.name || "—"}/>
          <BPField label="POSITION" value={mergedUser.position?.toUpperCase() || "—"}/>
          <BPField label="PAIRING" value={`${pairing.pairing_days || 1} ${t.days?.toUpperCase()}`}/>
          {dests.length > 1 && (
            <BPField label="ITINERARY" value={dests.map(d => d || "—").join(" → ")}/>
          )}
          <BPField label="DIET" value={dietDisplay}/>
          <BPField label="GOALS" value={(pairing.goals||[]).slice(0,2).join(", ").replace(/_/g," ").toUpperCase() || "—"}/>
          <BPField label="BUDGET" value={pairing.budget_amount ? `$${pairing.budget_amount}/${pairing.budget_type==="day"?"DAY":"TRIP"}` : "—"}/>
          {Math.abs(parseInt(pairing.timezone||0)) >= 4 && (
            <BPField label="JET LAG" value={`${pairing.timezone}H DIFF ⚠️`} highlight/>
          )}
          {pairing.going_usa === "yes" && (
            <BPField label="USA RULES" value="⚠️ FOOD RESTRICTIONS" highlight/>
          )}
        </div>

        {/* Barcode area */}
        <div style={styles.bpDividerDash}/>
        <div style={styles.bpBarcode}>
          {barcodeHeights.map((h,i) => (
            <div key={i} style={{...styles.bpBar, height: `${h}px`}}/>
          ))}
        </div>
        <div style={styles.bpBarcodeNum}>NCR{ticketNumber.slice(-8)}</div>

        {isPremiumNeeded && (
          <div style={styles.premiumBanner}>⭐ Premium required for this pairing</div>
        )}
      </div>

      <div style={styles.navRow}>
        <button style={styles.backBtn} onClick={onBack}>{t.back}</button>
        <button style={styles.primaryBtn} onClick={onGenerate}>
          <PlaneIcon size={16} color={C.navy}/> {t.generate}
        </button>
      </div>
    </div>
  );
}

function BPField({ label, value, highlight }) {
  return (
    <div style={styles.bpField}>
      <div style={styles.bpFieldLabel}>{label}</div>
      <div style={{...styles.bpFieldValue, ...(highlight?{color:C.gold}:{})}}>{value}</div>
    </div>
  );
}

// ─── PLAN SCREEN ──────────────────────────────────────────────────
function PlanScreen({ t, plan, loading, pairing, user, activeTab, setActiveTab, activeDay, setActiveDay, onNewPairing, favorites, onToggleFavorite, onOpenAirplaneMeal, isPremium }) {
  const days = pairing.pairing_days || 1;
  const hasJetlag = Math.abs(parseInt(pairing.timezone||0)) >= 4;

  if (loading) return (
    <div style={styles.loadingScreen}>
      <div style={styles.loadingPlane}>
        <PlaneIcon size={48} color={C.gold}/>
      </div>
      <div style={styles.loadingText}>{t.plan_loading}</div>
      <div style={styles.loadingDots}>
        <div style={styles.dot}/><div style={styles.dot}/><div style={styles.dot}/>
      </div>
    </div>
  );

  if (!plan || plan.error) return (
    <div style={styles.loadingScreen}>
      <div style={{fontSize:40}}>⚠️</div>
      <div style={styles.loadingText}>{t.plan_error}</div>
      <button style={styles.primaryBtn} onClick={onNewPairing}>{t.new_pairing}</button>
    </div>
  );

  return (
    <div style={styles.planScreen}>
      {/* Header */}
      <div style={styles.planHeader}>
        <div>
          <div style={styles.planTitle}>NutriCrew</div>
          <div style={styles.planSub}>{user?.name?.split(" ")[0]} · {days} {t.days}</div>
        </div>
        <button style={styles.newPairingBtn} onClick={onNewPairing}>
          + {t.new_pairing}
        </button>
      </div>

      {/* Nutritionist disclaimer */}
      <div style={styles.disclaimerBanner}>
        <span style={{fontSize:18}}>ℹ️</span>
        <div>
          <div style={styles.disclaimerBannerTitle}>{t.disclaimer_title}</div>
          <div style={styles.disclaimerBannerText}>{t.disclaimer_text}</div>
        </div>
      </div>

      {/* Jetlag warning */}
      {hasJetlag && (
        <div style={styles.jetlagBanner}>
          <span style={{fontSize:20}}>😴</span>
          <div>
            <div style={styles.jetlagBannerTitle}>{t.jetlag_advisory}</div>
            <div style={styles.jetlagBannerText}>{t.jetlag_note}</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabBar}>
        {["plan","grocery","restrictions","nearby"].map(tab => (
          <button key={tab}
            style={{...styles.tab, ...(activeTab===tab?styles.tabActive:{})}}
            onClick={() => setActiveTab(tab)}>
            {tab === "plan" ? "🍽️" : tab === "grocery" ? "🛒" : tab === "restrictions" ? "🚫" : "📍"}
            <span style={styles.tabLabel}>
              {tab === "plan" ? t.tab_plan : tab === "grocery" ? t.tab_grocery : tab === "restrictions" ? t.tab_restrictions : t.tab_nearby}
            </span>
            {tab === "nearby" && !isPremium && <span style={styles.premiumLockBadge}>👑</span>}
          </button>
        ))}
      </div>

      {/* Day selector */}
      {activeTab === "plan" && (
        <div style={styles.daySelector}>
          {[...Array(days)].map((_,i) => (
            <button key={i}
              style={{...styles.dayChip, ...(activeDay===i?styles.dayChipActive:{})}}
              onClick={() => setActiveDay(i)}>
              {t.day} {i+1}
            </button>
          ))}
        </div>
      )}

      <div style={styles.planContent}>
        {activeTab === "plan" && plan.days?.[activeDay] && (
          <DayPlan day={plan.days[activeDay]} t={t} favorites={favorites} onToggleFavorite={onToggleFavorite} onOpenAirplaneMeal={onOpenAirplaneMeal}/>
        )}
        {activeTab === "grocery" && plan.groceryList && (
          <GroceryList list={plan.groceryList}/>
        )}
        {activeTab === "restrictions" && plan.foodRestrictions && (
          <FoodRestrictions data={plan.foodRestrictions} pairing={pairing}/>
        )}
        {activeTab === "nearby" && (
          <NearbyPlaces t={t} pairing={pairing} user={user} isPremium={isPremium}/>
        )}
      </div>
    </div>
  );
}

function DayPlan({ day, t, favorites, onToggleFavorite, onOpenAirplaneMeal }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const mealColors = { Breakfast: C.gold, Lunch: C.sky, Dinner: C.green, Snack: C.muted };
  return (
    <div>
      <div style={styles.dayLabel2}>{day.label}</div>
      {day.jetlagNote && (
        <div style={styles.jetlagMealNote}>😴 {day.jetlagNote}</div>
      )}
      {day.meals?.map((meal, i) => {
        const mealId = `${meal.type}-${meal.name}`;
        const isFav = favorites?.some(f => f.id === mealId);
        const isOpen = expandedIdx === i;
        const color = mealColors[meal.type] || C.muted;
        return (
          <div key={i} style={{...styles.mealCard, borderLeftColor: color, padding: 0, overflow: "hidden"}}>
            {/* Collapsed header — tap to expand */}
            <div style={styles.mealHeader} onClick={() => setExpandedIdx(isOpen ? null : i)}>
              {meal.emoji && <span style={styles.mealEmoji}>{meal.emoji}</span>}
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{...styles.mealType, color, marginBottom: 3}}>
                  <PlaneIcon size={10} color={color}/> {meal.type}
                </div>
                <div style={styles.mealName}>{meal.name}</div>
              </div>
              <div style={styles.mealHeaderRight}>
                <span style={styles.mealCals}>🔥 {meal.calories}</span>
                <span style={{fontSize: 10, color: C.muted}}>{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>
            {/* Expanded body */}
            {isOpen && (
              <div style={styles.mealBody}>
                <div style={styles.mealDesc}>{meal.description}</div>
                <div style={styles.mealPrep}>🍳 {meal.prep}</div>
                <div style={styles.mealMacros}>
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbs}g</span>
                  <span>F: {meal.fat}g</span>
                  {meal.tags?.map(tag => <span key={tag} style={styles.tag}>{tag}</span>)}
                </div>
                {meal.tip && (
                  <div style={styles.postIt}>
                    <span style={styles.postItPin}>📌</span><span>{meal.tip}</span>
                  </div>
                )}
                {meal.recyclingTip && (
                  <div style={styles.postItGreen}>
                    <span style={styles.postItPin}>♻️</span><span>{meal.recyclingTip}</span>
                  </div>
                )}
                <div style={{display:"flex", gap:8, justifyContent:"flex-end", marginTop:8}}>
                  <button style={styles.favoriteBtn} onClick={e => { e.stopPropagation(); onOpenAirplaneMeal?.(); }} aria-label="check airplane meal" title={t?.airplane_meal_title}>🍱</button>
                  <button style={styles.favoriteBtn} onClick={e => { e.stopPropagation(); onToggleFavorite?.(meal); }} aria-label="favorite">{isFav ? "❤️" : "🤍"}</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <div style={styles.dailyTotal}>
        Total: <strong>{day.totalCalories} kcal</strong>
      </div>
    </div>
  );
}

function GroceryList({ list }) {
  const sections = [
    {key:"produce",label:"🥦 Produce",color:C.green},
    {key:"protein",label:"🥩 Protein",color:C.sky},
    {key:"pantry",label:"🥫 Pantry",color:C.gold},
    {key:"snacks",label:"🍫 Snacks",color:C.muted},
    {key:"dairy",label:"🥛 Dairy",color:"#9BB8D4"},
  ];
  return (
    <div>
      {sections.map(s => list[s.key]?.length > 0 && (
        <div key={s.key} style={styles.grocSection}>
          <div style={{...styles.grocTitle, color: s.color}}>{s.label}</div>
          {list[s.key].map((item,i) => (
            <div key={i} style={styles.grocItem}>
              <div style={styles.checkbox}/>
              <span style={styles.grocText}>{item}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function FoodRestrictions({ data, pairing }) {
  return (
    <div>
      {pairing.going_usa === "yes" && (
        <div style={styles.restrictCard}>
          <div style={styles.restrictTitle}>🇺🇸 USA Customs Rules</div>
          <div style={styles.restrictText}>{data.usa}</div>
        </div>
      )}
      {data.destination && (
        <div style={styles.restrictCard}>
          <div style={styles.restrictTitle}>🌍 {(pairing.destinations || []).join(", ")} Rules</div>
          <div style={styles.restrictText}>{data.destination}</div>
        </div>
      )}
      {data.general && (
        <div style={styles.restrictCard}>
          <div style={styles.restrictTitle}>ℹ️ General Tips</div>
          <div style={styles.restrictText}>{data.general}</div>
        </div>
      )}
    </div>
  );
}

function NearbyPlaces({ t, pairing, user, isPremium }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const city = (pairing.destinations || [])[0] || "";

  useEffect(() => {
    if (!isPremium || !city || !user?.email) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/api/places`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, email: user.email }),
    })
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setData(d); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [isPremium, city, user?.email]);

  if (!isPremium) {
    return (
      <div style={styles.nearbyLock}>
        <div style={{fontSize: 40, marginBottom: 12}}>👑</div>
        <div style={styles.nearbyLockTitle}>{t.nearby_premium_title}</div>
        <div style={styles.nearbyLockMsg}>{t.nearby_premium_msg}</div>
      </div>
    );
  }

  if (loading) return <div style={styles.nearbyLoading}>{t.nearby_loading}</div>;
  if (error) return <div style={styles.nearbyLoading}>{t.nearby_error}</div>;
  if (!data) return null;

  const PlaceCard = ({ place }) => (
    <div style={styles.placeCard}>
      <div style={styles.placeName}>{place.name}</div>
      {place.rating != null && (
        <div style={styles.placeRating}>{"★".repeat(Math.round(place.rating))}{"☆".repeat(5 - Math.round(place.rating))} {place.rating.toFixed(1)}</div>
      )}
      <div style={styles.placeAddress}>{place.address}</div>
      {place.open_now != null && (
        <div style={{...styles.placeStatus, color: place.open_now ? C.green : C.muted}}>
          {place.open_now ? t.nearby_open : t.nearby_closed}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={styles.nearbySection}>
        <div style={styles.nearbySectionTitle}>🛒 {t.nearby_groceries}</div>
        {data.groceries?.length ? data.groceries.map((p, i) => <PlaceCard key={i} place={p}/>) : <div style={styles.placeAddress}>No results found.</div>}
      </div>
      <div style={styles.nearbySection}>
        <div style={styles.nearbySectionTitle}>🥗 {t.nearby_restaurants}</div>
        {data.restaurants?.length ? data.restaurants.map((p, i) => <PlaceCard key={i} place={p}/>) : <div style={styles.placeAddress}>No results found.</div>}
      </div>
    </div>
  );
}

// ─── PREMIUM SCREEN ───────────────────────────────────────────────
function PremiumScreen({ t, onBack, onUpgrade, premiumSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onUpgrade();
    setLoading(false);
  };

  if (premiumSuccess) {
    return (
      <div style={styles.premiumScreen}>
        <div style={styles.premiumIcon}>🎉</div>
        <div style={styles.premiumTitle}>Welcome to Premium!</div>
        <div style={styles.premiumMsg}>Your account has been upgraded. Generate your next plan to unlock all premium features.</div>
        <button style={styles.primaryBtn} onClick={onBack}>Start Planning</button>
      </div>
    );
  }

  return (
    <div style={styles.premiumScreen}>
      <div style={styles.premiumIcon}>⭐</div>
      <div style={styles.premiumTitle}>{t.premium_title}</div>
      <div style={styles.premiumMsg}>{t.premium_msg}</div>
      <div style={styles.premiumFeatures}>
        {[
          "Unlimited meal plans",
          "Jetlag-optimized meal timing",
          "Country food rules",
          "Calorie deficit plans",
          "📍 Nearby stores & restaurants",
        ].map(f => (
          <div key={f} style={styles.premiumFeature}>✓ {f}</div>
        ))}
      </div>
      <button style={styles.primaryBtn} onClick={handleClick} disabled={loading}>
        {loading ? "…" : `${t.upgrade} — $9.99`}
      </button>
      <button style={{...styles.backBtn, flex: "none"}} onClick={onBack}>{t.back}</button>
    </div>
  );
}

// ─── CALORIE MODAL ────────────────────────────────────────────────
function CalorieModal({ t, text, setText, result, loading, onEstimate, onClose }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>{t.calorie_title}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <textarea style={styles.calorieInput} value={text}
          onChange={e => setText(e.target.value)}
          placeholder={t.calorie_placeholder} rows={4}/>
        <button style={styles.primaryBtn} onClick={onEstimate} disabled={loading || !text.trim()}>
          {loading ? "..." : t.calorie_btn}
        </button>
        {result && result.error && (
          <div style={styles.calorieError}>{t.calorie_error}</div>
        )}
        {result && !result.error && (
          <div style={styles.calorieResult}>
            <div style={styles.calResultTotal}>≈ {result.total} kcal</div>
            {result.breakdown?.map((item,i) => (
              <div key={i} style={styles.calBreakdown}>
                <span>{item.food}</span>
                <span style={{color:C.gold}}>{item.calories} kcal</span>
              </div>
            ))}
            {result.note && <div style={styles.calNote}>{result.note}</div>}
          </div>
        )}
        <div style={styles.calorieDisclaimer}>{t.calorie_disclaimer}</div>
      </div>
    </div>
  );
}

function AirplaneMealModal({ t, text, setText, result, loading, onCheck, onClose }) {
  const fitsColor = { yes: C.green, no: C.red, partial: C.gold }[result?.fits] || C.gold;
  const fitsIcon = { yes: "✅", no: "❌", partial: "⚠️" }[result?.fits] || "";
  const fitsLabel = { yes: t.fits_yes, no: t.fits_no, partial: t.fits_partial }[result?.fits] || "";
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>{t.airplane_meal_title}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <textarea style={styles.calorieInput} value={text}
          onChange={e => setText(e.target.value)}
          placeholder={t.airplane_meal_placeholder} rows={4}/>
        <button style={styles.primaryBtn} onClick={onCheck} disabled={loading || !text.trim()}>
          {loading ? "..." : t.airplane_meal_btn}
        </button>
        {result && result.error && (
          <div style={styles.calorieError}>{t.airplane_meal_error}</div>
        )}
        {result && !result.error && (
          <div style={styles.calorieResult}>
            <div style={{...styles.calResultTotal, color: fitsColor}}>{fitsIcon} {fitsLabel}</div>
            {result.dietNote && <div style={styles.calNote}>{result.dietNote}</div>}
            <div style={{...styles.calResultTotal, marginTop: 10}}>≈ {result.calories} kcal</div>
            {result.note && <div style={styles.calNote}>{result.note}</div>}
          </div>
        )}
        <div style={styles.calorieDisclaimer}>{t.calorie_disclaimer}</div>
      </div>
    </div>
  );
}

function JetlagModal({ t, pairing, onClose }) {
  const tz = parseInt(pairing.timezone || 0, 10);
  const hasJetlag = Math.abs(tz) >= 4;
  const tips = [t.jetlag_tip_1, t.jetlag_tip_2, t.jetlag_tip_3, t.jetlag_tip_4, t.jetlag_tip_5];
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>{t.jetlag_title}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {hasJetlag ? (
          <>
            <div style={{...styles.jetlagCard, marginTop: 0}}>
              <span style={{fontSize:18}}>🕐</span>
              <span>{t.jetlag_diff_label}: {Math.abs(tz)} {t.jetlag_hours} ({tz > 0 ? t.jetlag_ahead : t.jetlag_behind})</span>
            </div>
            <div style={styles.restrictCard}>
              <div style={styles.restrictTitle}>{tz > 0 ? t.jetlag_eastward_title : t.jetlag_westward_title}</div>
              <div style={styles.restrictText}>{tz > 0 ? t.jetlag_eastward_text : t.jetlag_westward_text}</div>
            </div>
          </>
        ) : (
          <div style={styles.restrictCard}>
            <div style={styles.restrictTitle}>{t.jetlag_none_title}</div>
            <div style={styles.restrictText}>{t.jetlag_none_text}</div>
          </div>
        )}

        <div style={styles.restrictCard}>
          <div style={styles.restrictTitle}>{t.jetlag_tips_title}</div>
          {tips.map((tip, i) => (
            <div key={i} style={styles.jetlagTipRow}>
              <span style={{color:C.gold}}>•</span>
              <span style={styles.restrictText}>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SavedMealsModal({ t, favorites, onToggleFavorite, onClose }) {
  const mealColors = { Breakfast: C.gold, Lunch: C.sky, Dinner: C.green, Snack: C.muted };
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>{t.saved_meals_title}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {(!favorites || favorites.length === 0) ? (
          <div style={styles.restrictCard}>
            <div style={styles.restrictText}>{t.saved_meals_empty}</div>
          </div>
        ) : (
          <div style={styles.savedMealsList}>
            {favorites.map((meal, i) => (
              <div key={meal.id || i} style={{...styles.mealCard, borderLeftColor: mealColors[meal.type] || C.muted}}>
                <div style={styles.mealTop}>
                  <span style={{...styles.mealType, color: mealColors[meal.type] || C.muted}}>
                    <PlaneIcon size={11} color={mealColors[meal.type] || C.muted}/> {meal.type}
                  </span>
                  <div style={styles.mealTopRight}>
                    <span style={styles.mealCals}>🔥 {meal.calories} kcal</span>
                    <button style={styles.favoriteBtn} onClick={() => onToggleFavorite?.(meal)} aria-label="favorite">❤️</button>
                  </div>
                </div>
                <div style={styles.mealName}>{meal.name}</div>
                <div style={styles.mealDesc}>{meal.description}</div>
                <div style={styles.mealMacros}>
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbs}g</span>
                  <span>F: {meal.fat}g</span>
                </div>
                <div style={styles.tagRow}>
                  {meal.tags?.map(tag => <span key={tag} style={styles.tag}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileModal({ t, user, onSave, onClose }) {
  const initialUnit = (user?.weight || "").toString().includes("lbs") ? "lbs" : "kg";
  const initialWeight = parseFloat(user?.weight) || "";
  const [gender, setGender] = useState(user?.gender || "");
  const [weightVal, setWeightVal] = useState(initialWeight ? String(initialWeight) : "");
  const [weightUnit, setWeightUnit] = useState(initialUnit);
  const [position, setPosition] = useState(user?.position || "");

  const handleSave = () => {
    onSave({
      gender,
      weight: weightVal ? `${weightVal}${weightUnit}` : user?.weight,
      position,
    });
    onClose();
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>{t.profile_title}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.restrictCard}>
          <div style={styles.restrictTitle}>{user?.name}</div>
          <div style={styles.restrictText}>{user?.email}</div>
          <div style={{...styles.restrictText, marginTop: 6, fontSize: 11}}>{t.profile_locked_note}</div>
        </div>

        <RadioGroup label={t.step_gender}
          options={[{v:"male",l:t.male},{v:"female",l:t.female},{v:"other",l:t.other}]}
          value={gender}
          onChange={setGender}/>

        <div>
          <div style={styles.inputLabel}>{t.step_weight}</div>
          <div style={styles.unitToggle}>
            {["kg","lbs"].map(u => (
              <button key={u} style={{...styles.unitBtn, ...(weightUnit===u?styles.unitBtnActive:{})}}
                onClick={() => setWeightUnit(u)}>{u}</button>
            ))}
          </div>
          <TextInput value={weightVal} type="number"
            onChange={setWeightVal}
            placeholder={weightUnit === "kg" ? "70" : "154"} icon="⚖️"/>
        </div>

        <RadioGroup label={t.step_position}
          options={[
            {v:"pilot",l:t.pilot,icon:"🛩️"},
            {v:"cabin",l:t.cabin,icon:"✈️"},
            {v:"mechanic",l:t.mechanic,icon:"🔧"},
            {v:"ground",l:t.ground,icon:"🚧"},
            {v:"atc",l:t.atc,icon:"📡"},
            {v:"dispatch",l:t.dispatch,icon:"📋"},
            {v:"other",l:t.other_role,icon:"👤"},
          ]}
          value={position}
          onChange={setPosition}/>

        <button style={styles.primaryBtn} onClick={handleSave}>{t.save_profile}</button>
      </div>
    </div>
  );
}

// ─── INPUT COMPONENTS ─────────────────────────────────────────────
function TextInput({ label, value, onChange, placeholder, icon, type = "text" }) {
  return (
    <div>
      {label && <div style={styles.inputLabel}>{label}</div>}
      <div style={styles.inputWrap}>
        {icon && <span style={styles.inputIcon}>{icon}</span>}
        <input style={styles.input} type={type} value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}/>
      </div>
    </div>
  );
}

function CalorieTargetStep({ t, pairing, user, upd }) {
  const weight = pairing.weight || user?.weight || "70kg";
  const gender = pairing.gender || user?.gender || "female";
  const age = parseInt(pairing.age || user?.age || 35, 10);

  // Parse weight string (e.g. "65kg", "145lbs") into kg
  const weightStr = String(weight);
  const weightVal = parseFloat(weightStr) || 70;
  const weightKg = /lb/i.test(weightStr) ? weightVal / 2.20462 : weightVal;

  // Mifflin-St Jeor BMR (default height 170 cm) × 1.55 for active crew
  const bmr = gender === "male"
    ? (10 * weightKg) + (6.25 * 170) - (5 * age) + 5
    : (10 * weightKg) + (6.25 * 170) - (5 * age) - 161;
  const tdee = Math.round((bmr * 1.55) / 50) * 50;

  const DEFICITS = { gentle: 250, moderate: 500, aggressive: 750 };

  const [selected, setSelected] = useState(pairing.calorie_deficit_preset || "moderate");
  const [customVal, setCustomVal] = useState(
    pairing.calorie_deficit_preset === "custom" ? String(pairing.calorie_target || "") : ""
  );
  const [customError, setCustomError] = useState("");

  // Seed the default moderate target on first mount if not already set
  useEffect(() => {
    if (!pairing.calorie_target) {
      const defaultTarget = Math.max(tdee - 500, 1200);
      upd("calorie_target", defaultTarget);
      upd("calorie_deficit_amount", 500);
      upd("calorie_deficit_preset", "moderate");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyPreset = (preset) => {
    setSelected(preset);
    setCustomError("");
    if (preset !== "custom") {
      const target = Math.max(tdee - DEFICITS[preset], 1200);
      upd("calorie_target", target);
      upd("calorie_deficit_amount", DEFICITS[preset]);
      upd("calorie_deficit_preset", preset);
    } else {
      upd("calorie_deficit_preset", "custom");
      upd("calorie_target", null);
    }
  };

  const validateCustom = (val) => {
    setCustomVal(val);
    const num = parseInt(val, 10);
    const max = tdee - 100;
    if (!val || isNaN(num) || num < 1200) {
      setCustomError(t.calorie_target_custom_error_low);
      upd("calorie_target", null);
      return;
    }
    if (num > max) {
      setCustomError((t.calorie_target_custom_error_high || "").replace("{max}", max));
      upd("calorie_target", null);
      return;
    }
    setCustomError("");
    upd("calorie_target", num);
    upd("calorie_deficit_amount", tdee - num);
  };

  const displayTarget = selected !== "custom"
    ? Math.max(tdee - (DEFICITS[selected] || 500), 1200)
    : pairing.calorie_target;

  const options = [
    { k: "gentle",     icon: "🌿", label: t.deficit_gentle },
    { k: "moderate",   icon: "⭐", label: t.deficit_moderate },
    { k: "aggressive", icon: "🔥", label: t.deficit_aggressive },
    { k: "custom",     icon: "✏️", label: t.deficit_custom },
  ];

  return (
    <div>
      <div style={{...styles.calorieResult, marginBottom: 12, textAlign: "center"}}>
        <div style={{fontSize: 13, color: C.muted, marginBottom: 4}}>
          {(t.calorie_target_based_on || "").replace("{weight}", weight)}
        </div>
        <div style={{fontSize: 14, color: C.skyLight, fontWeight: 600}}>
          {(t.calorie_target_tdee || "").replace("{tdee}", tdee.toLocaleString())}
        </div>
      </div>

      <div style={styles.inputLabel}>{t.calorie_target_select}</div>

      <div style={{display: "flex", flexDirection: "column", gap: 8, marginBottom: 12}}>
        {options.map(({ k, icon, label }) => (
          <button key={k}
            style={{...styles.radioCard, ...(selected === k ? styles.radioCardActive : {}),
              flexDirection: "row", alignItems: "center", textAlign: "left", gap: 10}}
            onClick={() => applyPreset(k)}>
            <span style={styles.radioIcon}>{icon}</span>
            <span style={{...styles.radioLabel, fontSize: 13}}>{label}</span>
          </button>
        ))}
      </div>

      {selected === "custom" && (
        <div style={{marginBottom: 12}}>
          <TextInput label={t.calorie_target_custom_label} type="number"
            value={customVal} onChange={validateCustom}
            placeholder="e.g. 1600" icon="🎯"/>
          {customError && <div style={{...styles.calorieError, marginTop: 8}}>{customError}</div>}
        </div>
      )}

      {displayTarget && (
        <div style={{...styles.calorieResult, marginBottom: 12, textAlign: "center"}}>
          <div style={{fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6}}>
            {t.calorie_target_result}
          </div>
          <div style={styles.calResultTotal}>{displayTarget.toLocaleString()} kcal</div>
          <div style={{fontSize: 11, color: C.muted, marginTop: -6}}>/ day</div>
        </div>
      )}

      <div style={styles.calorieDisclaimer}>{t.calorie_target_disclaimer}</div>
    </div>
  );
}

function RadioGroup({ label, options, value, onChange }) {
  return (
    <div>
      <div style={styles.inputLabel}>{label}</div>
      <div style={styles.radioGrid}>
        {options.map(o => (
          <button key={o.v}
            style={{...styles.radioCard, ...(value===o.v?styles.radioCardActive:{})}}
            onClick={() => onChange(o.v)}>
            {o.premium && <span style={styles.radioPremiumBadge}>👑</span>}
            {o.icon && <span style={styles.radioIcon}>{o.icon}</span>}
            <span style={styles.radioLabel}>{o.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckGroup({ label, options, values, onChange }) {
  const toggle = (v) => {
    const next = values.includes(v) ? values.filter(x=>x!==v) : [...values, v];
    onChange(next);
  };
  return (
    <div>
      <div style={styles.inputLabel}>{label}</div>
      <div style={styles.radioGrid}>
        {options.map(o => (
          <button key={o.v}
            style={{...styles.radioCard, ...(values.includes(o.v)?styles.radioCardActiveGreen:{})}}
            onClick={() => toggle(o.v)}>
            {o.premium && <span style={styles.radioPremiumBadge}>👑</span>}
            {o.icon && <span style={styles.radioIcon}>{o.icon}</span>}
            <span style={styles.radioLabel}>{o.l}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── API CALLS ────────────────────────────────────────────────────
async function generatePlan(data, lang) {
  // Calls our own backend (server.js), which builds the prompts, keeps the
  // Anthropic API key secret, and generates each day in parallel.
  const res = await fetch(`${API_BASE}/api/generate-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, lang })
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (res.status === 403 && body?.error === "premium_required") {
      throw Object.assign(new Error("premium_required"), { code: "premium_required", pairingCount: body.pairingCount });
    }
    throw new Error("Failed to generate plan");
  }
  return await res.json();
}

async function estimateCalories(description, lang) {
  const langName = lang === "fr" ? "French" : lang === "es" ? "Spanish" : "English";
  const prompt = `Estimate calories for this meal description. Respond in ${langName}. Return ONLY JSON:
"${description}"
{
  "total": 650,
  "breakdown": [
    {"food": "item name", "calories": 300}
  ],
  "note": "Brief note about accuracy"
}`;

  const res = await fetch(`${API_BASE}/api/estimate-calories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error("Failed to estimate calories");
  return await res.json();
}

async function checkAirplaneMeal(description, diets, dietOther, lang) {
  const langName = lang === "fr" ? "French" : lang === "es" ? "Spanish" : "English";
  const dietArr = Array.isArray(diets) ? diets : (diets ? [diets] : []);
  const filtered = dietArr.filter(d => d && d !== "none");
  const dietLabel = filtered.length === 0 ? "no specific diet"
    : filtered.map(d => d === "other" ? (dietOther || "custom") : d.replace(/_/g, " ")).join(" + ");
  const prompt = `A flight crew member follows this diet: "${dietLabel}". They were served this meal on the plane: "${description}".
Respond in ${langName}. Return ONLY JSON:
{
  "fits": "yes",
  "dietNote": "Brief explanation of whether this meal fits their diet and why",
  "calories": 650,
  "note": "Brief note about the calorie estimate accuracy"
}
"fits" must be exactly "yes", "no", or "partial". For diets that depend on certification (e.g. halal, kosher) where the description does not confirm that certification, respond "partial" and explain in "dietNote" what would need to be confirmed — do not respond "yes" based on an assumption that the ingredients could be certified.`;

  const res = await fetch(`${API_BASE}/api/check-airplane-meal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error("Failed to check airplane meal");
  return await res.json();
}

// ─── STYLES ───────────────────────────────────────────────────────
const styles = {
  root: {
    background: C.bg,
    minHeight: "100vh",
    fontFamily: "'Orbitron', 'Inter', system-ui, sans-serif",
    color: C.white,
    maxWidth: 440,
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
  },
  gridOverlay: {
    position: "fixed", inset: 0,
    backgroundImage: `linear-gradient(${C.navyBorder}22 1px, transparent 1px), linear-gradient(90deg, ${C.navyBorder}22 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
    pointerEvents: "none", zIndex: 0,
  },
  // SPLASH
  splash: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", zIndex: 1,
  },
  splashInner: { textAlign: "center", padding: "32px 24px" },
  langRow: { display: "flex", gap: 8, justifyContent: "center", marginBottom: 40 },
  langBtn: {
    padding: "6px 14px", borderRadius: 20, border: `1px solid ${C.navyBorder}`,
    background: "transparent", color: C.muted, fontSize: 13, cursor: "pointer",
    fontFamily: "inherit",
  },
  langBtnActive: { border: `1px solid ${C.gold}`, color: C.gold, background: `${C.gold}11` },
  logoArea: { marginBottom: 32, display: "flex", flexDirection: "column", alignItems: "center" },
  logoImgWrap: { position: "relative", marginBottom: 8 },
  logoImg: { width: 130, height: 130, borderRadius: 28, objectFit: "cover", border: `2px solid ${C.gold}44`, boxShadow: `0 0 32px ${C.gold}33` },
  logoGlow: { position: "absolute", inset: -10, borderRadius: 36, background: `radial-gradient(circle, ${C.gold}18 0%, transparent 70%)`, pointerEvents: "none" },
  appName: {
    fontSize: 38, fontWeight: 900, letterSpacing: "4px", color: C.white,
    textShadow: `0 0 30px ${C.gold}66`, marginTop: 12,
    fontFamily: "'Orbitron', sans-serif",
  },
  appTagline: { fontSize: 13, fontWeight: 600, color: C.skyLight, letterSpacing: "2px", marginTop: 6, textTransform: "uppercase" },
  appTaglineSub: { fontSize: 12, color: C.muted, marginTop: 8, textAlign: "center", maxWidth: 260, lineHeight: 1.5 },

  freeTrialBadge: {
    display: "inline-block", padding: "4px 14px", borderRadius: 20,
    border: `1px solid ${C.gold}`, color: C.gold, fontSize: 12,
    marginBottom: 16, letterSpacing: "1px",
  },
  primaryBtn: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "14px 28px", borderRadius: 12,
    background: `linear-gradient(135deg, ${C.gold}, #A07830)`,
    border: "none", color: C.navy, fontSize: 14, fontWeight: 800,
    cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px",
    boxShadow: `0 4px 20px ${C.gold}44`,
  },
  secondaryBtn: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "12px 28px", borderRadius: 12,
    background: "transparent", border: `1px solid ${C.navyBorder}`,
    color: C.skyLight, fontSize: 13, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px",
  },
  welcomeBack: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  wbTitle: { fontSize: 16, color: C.skyLight, letterSpacing: "1px" },
  // CHECK-IN
  checkin: {
    minHeight: "100vh", padding: "16px", position: "relative", zIndex: 1,
    display: "flex", flexDirection: "column",
  },
  checkinHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12,
  },
  checkinHeaderLeft: { display: "flex", alignItems: "center", gap: 8 },
  checkinBrand: { fontSize: 14, fontWeight: 700, letterSpacing: "2px", color: C.gold },
  stepCounter: { fontSize: 12, color: C.muted },
  progressTrack: {
    height: 3, background: C.navyBorder, borderRadius: 2, marginBottom: 20, overflow: "hidden",
  },
  progressFill: {
    height: "100%", background: `linear-gradient(90deg, ${C.gold}, ${C.sky})`,
    borderRadius: 2, transition: "width 0.4s ease",
  },
  passportFrame: {
    flex: 1, background: C.navyMid, borderRadius: 16,
    border: `1px solid ${C.navyBorder}`, overflow: "hidden",
    boxShadow: `0 8px 32px ${C.bg}88`,
  },
  passportHeader: {
    background: C.navyCard, padding: "16px 20px",
    display: "flex", alignItems: "center", gap: 12,
    borderBottom: `1px solid ${C.navyBorder}`,
  },
  passportTitle: { fontSize: 16, fontWeight: 800, letterSpacing: "3px", color: C.gold },
  passportSub: { fontSize: 9, color: C.muted, letterSpacing: "2px", marginTop: 2 },
  passportBody: { padding: "20px" },
  passportMRZ: {
    background: C.bg, padding: "10px 16px",
    borderTop: `1px solid ${C.navyBorder}`,
  },
  mrzLine: { fontSize: 8, color: C.muted, letterSpacing: "1.5px", lineHeight: "1.6" },
  // INPUTS
  inputLabel: {
    fontSize: 11, color: C.muted, letterSpacing: "2px", marginBottom: 10,
    textTransform: "uppercase",
  },
  inputWrap: {
    display: "flex", alignItems: "center", gap: 10,
    background: C.navyCard, borderRadius: 10, border: `1px solid ${C.navyBorder}`,
    padding: "12px 14px",
  },
  inputIcon: { fontSize: 18 },
  input: {
    flex: 1, background: "transparent", border: "none", color: C.white,
    fontSize: 15, fontFamily: "inherit", outline: "none",
  },
  hint: { fontSize: 11, color: C.muted, marginTop: 6 },
  jetlagCard: {
    display: "flex", gap: 10, alignItems: "center", marginTop: 12,
    background: `${C.gold}15`, border: `1px solid ${C.gold}44`,
    borderRadius: 10, padding: "12px 14px", fontSize: 13, color: C.goldLight,
  },
  unitToggle: { display: "flex", gap: 8, marginBottom: 12 },
  unitBtn: {
    padding: "6px 16px", borderRadius: 8, border: `1px solid ${C.navyBorder}`,
    background: "transparent", color: C.muted, fontSize: 12, cursor: "pointer",
    fontFamily: "inherit",
  },
  unitBtnActive: { border: `1px solid ${C.sky}`, color: C.sky, background: `${C.sky}15` },
  daysRow: { display: "flex", gap: 8 },
  dayBtn: {
    flex: 1, padding: "14px 8px", borderRadius: 12,
    border: `1px solid ${C.navyBorder}`, background: C.navyCard,
    color: C.muted, cursor: "pointer", fontFamily: "inherit",
    display: "flex", flexDirection: "column", alignItems: "center",
  },
  dayBtnActive: { border: `1px solid ${C.gold}`, color: C.gold, background: `${C.gold}15` },
  dayNum: { fontSize: 24, fontWeight: 800 },
  dayLabel: { fontSize: 9, letterSpacing: "1px", textTransform: "uppercase" },
  radioGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  radioCard: {
    padding: "12px 10px", borderRadius: 10, border: `1px solid ${C.navyBorder}`,
    background: C.navyCard, color: C.muted, cursor: "pointer", fontFamily: "inherit",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center",
    position: "relative",
  },
  radioCardActive: { border: `1px solid ${C.sky}`, color: C.white, background: `${C.sky}15` },
  radioCardActiveGreen: { border: `1px solid ${C.green}`, color: C.white, background: `${C.green}15` },
  radioIcon: { fontSize: 20 },
  radioLabel: { fontSize: 12 },
  radioPremiumBadge: { position: "absolute", top: 6, right: 8, fontSize: 12, lineHeight: 1 },
  navRow: {
    display: "flex", gap: 10, marginTop: 16, paddingBottom: 8,
  },
  backBtn: {
    flex: 1, padding: "13px", borderRadius: 10,
    background: "transparent", border: `1px solid ${C.navyBorder}`,
    color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
  },
  continueBtn: {
    flex: 2, padding: "13px", borderRadius: 10,
    background: `linear-gradient(135deg, ${C.gold}, #A07830)`,
    border: "none", color: C.navy, fontSize: 14, fontWeight: 800,
    cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px",
  },
  continueBtnDisabled: {
    background: C.navyCard, color: C.muted, cursor: "not-allowed",
  },
  // BOARDING PASS
  boardingWrap: {
    padding: "16px", position: "relative", zIndex: 1,
    display: "flex", flexDirection: "column", gap: 16, minHeight: "100vh",
  },
  boardingCard: {
    background: C.navyMid, borderRadius: 20,
    border: `1px solid ${C.navyBorder}`,
    overflow: "hidden",
    boxShadow: `0 12px 40px ${C.bg}`,
  },
  bpHeader: {
    background: `linear-gradient(135deg, ${C.navyCard}, ${C.navy})`,
    padding: "20px 24px", display: "flex",
    justifyContent: "space-between", alignItems: "center",
  },
  bpAirline: { fontSize: 14, fontWeight: 800, letterSpacing: "3px", color: C.gold },
  bpDividerDash: {
    borderTop: `2px dashed ${C.navyBorder}`, margin: "0 20px",
  },
  bpRoute: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "24px",
  },
  bpCity: { textAlign: "center" },
  bpCode: { fontSize: 36, fontWeight: 900, color: C.white, letterSpacing: "3px" },
  bpCityName: { fontSize: 11, color: C.muted, marginTop: 4 },
  bpArrow: { display: "flex", flexDirection: "column", alignItems: "center", flex: 1 },
  bpLine: { width: "80%", height: 1, background: C.navyBorder, marginTop: 4 },
  bpGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
    background: C.navyBorder, margin: "0 0",
  },
  bpField: {
    background: C.navyMid, padding: "12px 16px",
  },
  bpFieldLabel: { fontSize: 9, color: C.muted, letterSpacing: "2px", marginBottom: 4 },
  bpFieldValue: { fontSize: 13, fontWeight: 700, color: C.white },
  bpBarcode: {
    display: "flex", gap: 2, padding: "16px 24px",
    alignItems: "flex-end", justifyContent: "center",
  },
  bpBar: {
    width: 3, background: C.white, borderRadius: 1, opacity: 0.8,
  },
  bpBarcodeNum: {
    textAlign: "center", fontSize: 10, color: C.muted,
    letterSpacing: "3px", paddingBottom: 12,
  },
  premiumBanner: {
    background: `${C.gold}20`, border: `1px solid ${C.gold}44`,
    padding: "10px 16px", textAlign: "center", fontSize: 13, color: C.gold,
  },
  // PLAN
  planScreen: {
    minHeight: "100vh", padding: "0 0 80px", position: "relative", zIndex: 1,
  },
  planHeader: {
    background: C.navyMid, padding: "16px 20px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    borderBottom: `1px solid ${C.navyBorder}`, position: "sticky", top: 0, zIndex: 10,
  },
  planTitle: { fontSize: 16, fontWeight: 800, letterSpacing: "2px", color: C.gold },
  planSub: { fontSize: 11, color: C.muted, marginTop: 2 },
  newPairingBtn: {
    padding: "7px 12px", borderRadius: 8, border: `1px solid ${C.navyBorder}`,
    background: "transparent", color: C.muted, fontSize: 11, cursor: "pointer",
    fontFamily: "inherit",
  },
  jetlagBanner: {
    display: "flex", gap: 12, alignItems: "flex-start",
    background: `${C.gold}12`, borderLeft: `3px solid ${C.gold}`,
    padding: "14px 20px", margin: "0",
  },
  jetlagBannerTitle: { fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 4 },
  jetlagBannerText: { fontSize: 12, color: C.muted },
  disclaimerBanner: {
    display: "flex", gap: 12, alignItems: "flex-start",
    background: `${C.sky}12`, borderLeft: `3px solid ${C.sky}`,
    padding: "14px 20px", margin: "0",
  },
  disclaimerBannerTitle: { fontSize: 13, fontWeight: 700, color: C.skyLight, marginBottom: 4 },
  disclaimerBannerText: { fontSize: 12, color: C.muted, lineHeight: 1.5 },
  tabBar: {
    display: "flex", gap: 0, background: C.navyMid,
    borderBottom: `1px solid ${C.navyBorder}`,
  },
  tab: {
    flex: 1, padding: "12px 4px", border: "none", background: "transparent",
    color: C.muted, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    borderBottom: "2px solid transparent",
  },
  tabActive: { color: C.gold, borderBottom: `2px solid ${C.gold}` },
  tabLabel: { fontSize: 9, letterSpacing: "0.5px" },
  daySelector: {
    display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto",
    background: C.bg,
  },
  dayChip: {
    flexShrink: 0, padding: "7px 14px", borderRadius: 20,
    border: `1px solid ${C.navyBorder}`, background: "transparent",
    color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
  },
  dayChipActive: { border: `1px solid ${C.sky}`, color: C.sky, background: `${C.sky}15` },
  planContent: { padding: "16px" },
  dayLabel2: { fontSize: 13, color: C.sky, marginBottom: 12, letterSpacing: "1px" },
  jetlagMealNote: {
    background: `${C.gold}12`, border: `1px solid ${C.gold}33`,
    borderRadius: 8, padding: "10px 12px", fontSize: 12, color: C.goldLight,
    marginBottom: 12,
  },
  mealCard: {
    background: C.navyMid, borderRadius: 12,
    marginBottom: 10, borderLeft: "3px solid",
    border: `1px solid ${C.navyBorder}`,
  },
  mealHeader: {
    display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
    cursor: "pointer", userSelect: "none",
  },
  mealEmoji: { fontSize: 30, lineHeight: 1, flexShrink: 0 },
  mealHeaderRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 },
  mealBody: { padding: "0 14px 14px", borderTop: `1px solid ${C.navyBorder}` },
  mealTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  mealType: {
    fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
    display: "inline-flex", alignItems: "center", gap: 5,
  },
  mealTopRight: { display: "flex", alignItems: "center", gap: 10 },
  mealCals: { fontSize: 12, color: C.gold, fontWeight: 700 },
  favoriteBtn: {
    background: "transparent", border: "none", cursor: "pointer",
    fontSize: 17, lineHeight: 1, padding: 0,
  },
  mealName: { fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 0 },
  mealDesc: { fontSize: 12, color: C.muted, marginBottom: 8 },
  mealPrep: { fontSize: 12, color: C.sky, marginBottom: 8 },
  mealMacros: {
    display: "flex", gap: 12, fontSize: 11, color: C.muted,
    borderTop: `1px dashed ${C.navyBorder}`, paddingTop: 8, marginBottom: 8,
  },
  tagRow: { display: "flex", gap: 6, flexWrap: "wrap" },
  tag: {
    fontSize: 10, padding: "2px 8px", borderRadius: 20,
    background: C.navyCard, color: C.muted, border: `1px solid ${C.navyBorder}`,
  },
  postIt: {
    marginTop: 10, background: "#FFE066", color: "#3a2f00",
    borderRadius: "2px 10px 10px 2px", padding: "8px 12px",
    fontSize: 12, lineHeight: 1.4, fontStyle: "italic",
    boxShadow: "2px 3px 6px rgba(0,0,0,0.3)", transform: "rotate(-1deg)",
    display: "flex", gap: 6, alignItems: "flex-start",
  },
  postItGreen: {
    marginTop: 10, background: "#C8E6C9", color: "#1b3a1f",
    borderRadius: "2px 10px 10px 2px", padding: "8px 12px",
    fontSize: 12, lineHeight: 1.4, fontStyle: "italic",
    boxShadow: "2px 3px 6px rgba(0,0,0,0.3)", transform: "rotate(1deg)",
    display: "flex", gap: 6, alignItems: "flex-start",
  },
  postItPin: { fontSize: 13, flexShrink: 0 },
  dailyTotal: {
    textAlign: "right", fontSize: 14, color: C.muted, marginTop: 4,
    paddingTop: 8, borderTop: `1px solid ${C.navyBorder}`,
  },
  grocSection: { marginBottom: 20 },
  grocTitle: { fontSize: 13, fontWeight: 700, marginBottom: 8, letterSpacing: "1px" },
  grocItem: {
    display: "flex", gap: 10, alignItems: "center",
    padding: "8px 0", borderBottom: `1px solid ${C.navyBorder}`,
  },
  checkbox: {
    width: 16, height: 16, borderRadius: 4,
    border: `1.5px solid ${C.navyBorder}`, flexShrink: 0,
  },
  grocText: { fontSize: 13, color: C.white },
  restrictCard: {
    background: C.navyMid, borderRadius: 12, padding: "14px",
    marginBottom: 12, border: `1px solid ${C.navyBorder}`,
  },
  restrictTitle: { fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 8 },
  restrictText: { fontSize: 13, color: C.muted, lineHeight: 1.6 },
  // NEARBY
  nearbyLock: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "48px 24px", gap: 12, textAlign: "center",
  },
  nearbyLockTitle: { fontSize: 18, fontWeight: 700, color: C.gold },
  nearbyLockMsg: { fontSize: 14, color: C.muted, lineHeight: 1.6, maxWidth: 280 },
  nearbyLoading: { padding: "40px 24px", textAlign: "center", color: C.muted, fontSize: 14 },
  nearbySection: { marginBottom: 28 },
  nearbySectionTitle: { fontSize: 15, fontWeight: 700, color: C.gold, marginBottom: 12 },
  placeCard: {
    background: C.navyMid, borderRadius: 12, padding: "14px 16px",
    marginBottom: 10, border: `1px solid ${C.navyBorder}`,
  },
  placeName: { fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 4 },
  placeRating: { fontSize: 13, color: C.gold, marginBottom: 4 },
  placeAddress: { fontSize: 13, color: C.muted, lineHeight: 1.5 },
  placeStatus: { fontSize: 12, fontWeight: 600, marginTop: 6 },
  premiumLockBadge: { fontSize: 10, marginLeft: 3 },
  // PREMIUM
  premiumScreen: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "32px 24px", gap: 16, position: "relative", zIndex: 1,
  },
  premiumIcon: { fontSize: 48 },
  premiumTitle: { fontSize: 22, fontWeight: 800, letterSpacing: "2px", color: C.gold },
  premiumMsg: { fontSize: 14, color: C.muted, textAlign: "center" },
  premiumFeatures: { alignSelf: "stretch" },
  premiumFeature: {
    padding: "10px 16px", borderBottom: `1px solid ${C.navyBorder}`,
    fontSize: 14, color: C.white,
  },
  // FLOAT
  floatBtn: {
    position: "fixed", bottom: 24, right: 20,
    width: 52, height: 52, borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.navyCard}, ${C.navyMid})`,
    border: `1.5px solid ${C.gold}`, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 4px 16px ${C.gold}33`, zIndex: 100,
  },
  floatBtnJetlag: {
    position: "fixed", bottom: 88, right: 20,
    width: 52, height: 52, borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.navyCard}, ${C.navyMid})`,
    border: `1.5px solid ${C.gold}`, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 4px 16px ${C.gold}33`, zIndex: 100,
  },
  floatBtnSaved: {
    position: "fixed", bottom: 152, right: 20,
    width: 52, height: 52, borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.navyCard}, ${C.navyMid})`,
    border: `1.5px solid ${C.gold}`, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 4px 16px ${C.gold}33`, zIndex: 100,
  },
  profileBtn: {
    position: "fixed", top: 16, right: 16,
    width: 40, height: 40, borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.navyCard}, ${C.navyMid})`,
    border: `1.5px solid ${C.gold}`, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 4px 16px ${C.gold}33`, zIndex: 100,
  },
  jetlagTipRow: {
    display: "flex", gap: 8, marginBottom: 6,
  },
  savedMealsList: {
    display: "flex", flexDirection: "column",
    maxHeight: "60vh", overflowY: "auto", paddingRight: 4,
  },
  // CALORIE MODAL
  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(7,16,30,0.92)",
    display: "flex", alignItems: "flex-end", justifyContent: "center",
    zIndex: 200, padding: "0 0 0 0",
  },
  modal: {
    background: C.navyMid, borderRadius: "20px 20px 0 0",
    border: `1px solid ${C.navyBorder}`, padding: "24px",
    width: "100%", maxWidth: 440,
    maxHeight: "85vh", overflowY: "auto",
    display: "flex", flexDirection: "column", gap: 14,
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  modalTitle: { fontSize: 16, fontWeight: 700, color: C.gold, letterSpacing: "1px" },
  closeBtn: {
    background: "transparent", border: "none", color: C.muted,
    fontSize: 18, cursor: "pointer",
  },
  calorieInput: {
    background: C.navyCard, border: `1px solid ${C.navyBorder}`,
    borderRadius: 10, padding: "12px", color: C.white,
    fontSize: 14, fontFamily: "inherit", resize: "none", outline: "none",
  },
  calorieResult: {
    background: C.navyCard, borderRadius: 10, padding: "14px",
    border: `1px solid ${C.navyBorder}`,
  },
  calResultTotal: {
    fontSize: 28, fontWeight: 800, color: C.gold, marginBottom: 12,
    textAlign: "center",
  },
  calBreakdown: {
    display: "flex", justifyContent: "space-between",
    padding: "6px 0", borderBottom: `1px solid ${C.navyBorder}`,
    fontSize: 13,
  },
  calNote: { fontSize: 11, color: C.muted, marginTop: 10 },
  calorieError: {
    background: C.navyCard, borderRadius: 10, padding: "14px",
    border: `1px solid ${C.red}`, color: C.red, fontSize: 13, textAlign: "center",
  },
  calorieDisclaimer: { fontSize: 10, color: C.muted, textAlign: "center", opacity: 0.8 },
  // LOADING
  loadingScreen: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 20, position: "relative", zIndex: 1,
  },
  loadingPlane: { animation: "float 2s ease-in-out infinite" },
  loadingText: { fontSize: 14, color: C.muted, letterSpacing: "1px" },
  loadingDots: { display: "flex", gap: 8 },
  dot: {
    width: 8, height: 8, borderRadius: "50%", background: C.gold,
    animation: "pulse 0.8s ease-in-out infinite alternate",
  },
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; }
  input::placeholder { color: ${C.muted}; }
  textarea::placeholder { color: ${C.muted}; }
  button:hover { opacity: 0.88; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: ${C.navyMid}; }
  ::-webkit-scrollbar-thumb { background: ${C.navyBorder}; border-radius: 2px; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pulse { from{opacity:0.3;transform:scale(0.8)} to{opacity:1;transform:scale(1.1)} }
`;
