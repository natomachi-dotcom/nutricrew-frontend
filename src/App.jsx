import { useState, useEffect, useRef, startTransition } from "react";
import { FAQ } from "./faq.js";

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
  muted:   "#B8CCDE",
  red:     "#E05555",
  bg:      "#07101E",
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────
const T = {
  en: {
    tagline: "Fuel Your Flight",
    tagline_sub: "Nutrition, jet lag, and meal planning built for flight crews",
    contact_us: "Questions? Contact us",
    faq_title: "FAQ",
    faq_heading: "Frequently Asked Questions",
    start: "Begin Check-In",
    step_lang: "Select Language",
    step_name: "Full Name",
    step_email: "Email Address",
    step_gender: "Gender",
    step_weight: "Weight",
    step_age: "Date of Birth",
    step_position: "Your Role",
    step_pairing: "Pairing Length",
    step_route: "Your Route",
    destination_label: "Destination",
    step_usa: "Flying to the USA?",
    step_kitchen: "Kitchen Access",
    step_lunch_bag: "Lunch Bag Size",
    bag_small: "Small  — fits 1–2 containers (~4L)",
    bag_medium: "Medium — fits 2–3 containers (~6L)",
    bag_large: "Large  — fits 3–4 containers + extras (~10L)",
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
    microwave: "Microwave Only", fridge: "Fridge, No Stove", airplane_food: "Airplane Meals Provided",
    step_cooking_pref: "Cooking Preference", cooking_enjoy: "I Enjoy Cooking", cooking_simple: "I Need Simple Recipes",
    no_restrictions: "No Restrictions", vegetarian: "Vegetarian",
    vegan: "Vegan", gluten_free: "Gluten-Free", halal: "Halal",
    kosher: "Kosher", low_carb: "Low-Carb / Keto",
    dairy_free: "Dairy-Free", mediterranean: "Mediterranean", carnivore: "Carnivore",
    paleo: "Paleo", calorie_deficit: "Calorie Deficit ⭐",
    diet_other: "Other", diet_other_placeholder: "Tell us about your diet...",
    allergies_section: "Allergies & Intolerances",
    nut_free: "Nut-Free", egg_free: "Egg-Free", shellfish_free: "Shellfish-Free",
    soy_free: "Soy-Free", lactose_free: "Lactose-Free", fodmap: "Low-FODMAP",
    offline_banner: "Offline — showing last saved plan",
    offline_generate: "No connection — generating a new plan requires internet.",
    history_btn: "Plan History", history_title: "Plan History",
    history_empty: "No saved plans yet. Generate your first plan to see it here.",
    history_open: "Open",
    feedback_prompt: "How did this plan work for you?",
    feedback_energy: "Energy", feedback_satiety: "Satiety", feedback_jetlag: "Jet Lag",
    feedback_comment_placeholder: "Any notes? What worked or didn't... (optional)",
    feedback_submit: "Submit Feedback", feedback_thanks: "Thanks for your feedback!",
    lose_weight: "Lose Weight", keep_weight: "Maintain Weight", gain_weight: "Gain Weight",
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
    jetlag_fab: "Jet Lag",
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
    airplane_meal_error: "Couldn't check that meal right now. Try again.",
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
    try_again: "Try Again",
    view_last_plan: "View Last Plan",
    saved_meals_title: "Saved Meals",
    saved_fab: "Saved",
    saved_meals_empty: "No saved meals yet. Tap the heart on any meal to save it here.",
    welcome_back: "Welcome back",
    profile_title: "Edit Profile",
    profile_locked_note: "Name and email can't be changed here.",
    save_profile: "Save Changes",
    disclaimer_title: "Disclaimer",
    disclaimer_text: "NutriCrew plans are generated by AI and are for informational purposes only. We are not licensed nutritionists or dietitians. Please consult a qualified healthcare professional before making significant changes to your diet.",
    calorie_disclaimer: "Estimates only — not medical advice.",
    plan_loading: "Preparing your nutrition plan...",
    plan_error: "The kitchen's unavailable right now. Check your connection and tap Retry.",
    calorie_error: "Couldn't reach the kitchen. Check your connection and try again.",
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
    step_airplane_meal: "What Will You Eat on the Plane?",
    airplane_meal_plan_placeholder: "e.g. chicken with rice and salad, bread roll, juice, chocolate cake...",
    airplane_meal_plan_skip: "Skip — I'll decide on the flight",
    airplane_meal_plan_hint: "Tell us what's on the menu so the AI can plan around it. Optional.",
    roster_btn: "Monthly Roster",
    roster_fab: "Roster",
    roster_title: "Upload Your Roster",
    roster_hint: "Take 1–2 screenshots of your monthly roster. The AI reads the schedule and generates a meal plan before each pairing automatically.",
    roster_upload_btn: "Choose Photos",
    roster_parsing: "Reading your roster…",
    roster_confirm_title: "Pairings Found",
    roster_confirm_hint: "Check the pairings below and confirm to schedule your plans.",
    roster_confirm_btn: "Schedule All Plans",
    roster_saving: "Saving pairings…",
    roster_done_title: "Your Month is Scheduled!",
    roster_done_subtitle: "Here's what's coming for you:",
    roster_done_flow: "24h before → Tap your kitchen → Meal plan arrives",
    roster_done_btn: "Done",
    gym_plan_btn: "View My Gym Plan",
    gym_plan_fab: "Gym Plan",
    gym_plan_none_msg: "No gym plan for this month yet. Upload your roster to generate one.",
    gym_plan_title: "Monthly Gym Plan",
    gym_plan_rest: "Rest Day",
    gym_plan_watch: "Watch",
    roster_no_pairings: "No upcoming pairings found. Make sure the photo shows future dates.",
    roster_error: "Could not read the roster. Please try a clearer photo.",
    roster_home_base: "Your Home Base City",
    roster_home_base_placeholder: "e.g. Miami, London, Paris…",
    roster_edit: "Edit",
    roster_delete: "Remove",
    roster_save_edit: "Save",
    roster_cancel_edit: "Cancel",
    roster_add_pairing: "+ Add Pairing",
    roster_going_usa: "Going to USA?",
    roster_dest_label: "Destinations (comma-separated)",
    roster_depart_label: "Departure Date (YYYY-MM-DD)",
    roster_return_label: "Return Date (YYYY-MM-DD)",
    roster_confirm_all: "All Correct — Schedule Plans",
    step_duty: "Your Duty Schedule",
    duty_report: "Report Time",
    duty_length: "Duty Length",
    duty_layover: "Layover Type",
    layover_short: "Short  ≤8h",
    layover_standard: "Standard 8–24h",
    layover_long: "Long  24h+",
    duty_direction: "Flight Direction",
    dir_east: "Eastward",
    dir_west: "Westward",
    dir_ns: "North/South",
    duty_skip: "Skip — standard pairing",
    tab_performance: "Performance",
    perf_advisory_title: "Duty Performance Advisory",
    perf_badge: "🧠 Cognitive Mode",
    val_enter_name: "Enter your name to continue.",
    val_enter_email: "Enter your email to continue.",
    val_select_one: "Pick one to continue.",
    val_enter_weight: "Enter your weight to continue.",
    val_select_dob: "Select your date of birth to continue.",
    val_dob_young: "You must be at least 16 to use NutriCrew.",
    val_dob_old: "Must be 80 or under to continue.",
    val_select_kitchen: "Select at least one kitchen option to continue.",
    val_select_diet: "Select at least one diet option to continue.",
    val_diet_describe: "Describe your diet above to continue.",
    val_select_goal: "Pick at least one goal to continue.",
    val_enter_budget: "Enter your budget to continue.",
    val_select_days: "Choose your pairing length to continue.",
    val_fill_dest: "Fill in all destinations to continue.",
    val_select_usa: "Select yes or no to continue.",
    hydration_target: "Daily Water Target",
    hydration_longhauul: "Long-haul pairing — cabin altitude accelerates dehydration",
    hydration_medium: "Medium-haul pairing — drink more than you would on the ground",
    hydration_domestic: "Keep sipping steadily through your duty",
    share_btn: "Share Plan",
    share_copied: "Link copied to clipboard!",
    share_title: "My NutriCrew Nutrition Plan",
    share_text: "Check out my crew nutrition plan from NutriCrew!",
    referral_title: "Invite Crew",
    referral_desc: "Share your link — you both get a free extra pairing.",
    referral_copy: "Copy Invite Link",
    referral_copied: "Copied!",
    referral_applied: "Referral applied — you get a free extra pairing!",
  },
  fr: {
    tagline: "Alimentez Votre Vol",
    tagline_sub: "Nutrition, décalage horaire et planification des repas pour le personnel de cabine",
    contact_us: "Des questions ? Contactez-nous",
    faq_title: "FAQ",
    faq_heading: "Foire Aux Questions",
    start: "Commencer l'Enregistrement",
    step_lang: "Choisir la Langue",
    step_name: "Nom Complet",
    step_email: "Adresse Email",
    step_gender: "Genre",
    step_weight: "Poids",
    step_age: "Date de Naissance",
    step_position: "Votre Rôle",
    step_pairing: "Durée du Pairing",
    step_route: "Votre Route",
    destination_label: "Destination",
    step_usa: "Vol vers les États-Unis?",
    step_kitchen: "Accès Cuisine",
    step_lunch_bag: "Taille du Sac Repas",
    bag_small: "Petit  — 1–2 boîtes (~4L)",
    bag_medium: "Moyen — 2–3 boîtes (~6L)",
    bag_large: "Grand  — 3–4 boîtes + extras (~10L)",
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
    microwave: "Micro-ondes Seulement", fridge: "Frigo, Sans Cuisinière", airplane_food: "Repas Avion Fournis",
    step_cooking_pref: "Préférence de Cuisine", cooking_enjoy: "J'aime Cuisiner", cooking_simple: "Je Veux des Recettes Simples",
    no_restrictions: "Sans Restrictions", vegetarian: "Végétarien",
    vegan: "Végétalien", gluten_free: "Sans Gluten", halal: "Halal",
    kosher: "Casher", low_carb: "Faible en Glucides",
    dairy_free: "Sans Produits Laitiers", mediterranean: "Méditerranéen", carnivore: "Carnivore",
    paleo: "Paléo", calorie_deficit: "Déficit Calorique ⭐",
    diet_other: "Autre", diet_other_placeholder: "Décrivez votre alimentation...",
    allergies_section: "Allergies & Intolérances",
    nut_free: "Sans Noix", egg_free: "Sans Œufs", shellfish_free: "Sans Fruits de Mer",
    soy_free: "Sans Soja", lactose_free: "Sans Lactose", fodmap: "FODMAP Faible",
    offline_banner: "Hors ligne — affichage du dernier plan sauvegardé",
    offline_generate: "Hors ligne — générer un nouveau plan nécessite une connexion internet.",
    history_btn: "Historique", history_title: "Historique des plans",
    history_empty: "Aucun plan sauvegardé. Générez votre premier plan pour le voir ici.",
    history_open: "Ouvrir",
    feedback_prompt: "Comment ce plan a-t-il fonctionné?",
    feedback_energy: "Énergie", feedback_satiety: "Satiété", feedback_jetlag: "Décalage Horaire",
    feedback_comment_placeholder: "Des notes? Ce qui a fonctionné ou non... (optionnel)",
    feedback_submit: "Envoyer", feedback_thanks: "Merci pour vos commentaires!",
    lose_weight: "Perdre du Poids", keep_weight: "Maintenir le Poids", gain_weight: "Prendre du Poids",
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
    jetlag_fab: "Décalage",
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
    airplane_meal_error: "Impossible de vérifier ce repas. Réessayez.",
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
    try_again: "Réessayer",
    view_last_plan: "Voir le Dernier Plan",
    saved_meals_title: "Repas Enregistrés",
    saved_fab: "Sauvés",
    saved_meals_empty: "Aucun repas enregistré. Touchez le cœur sur un repas pour l'enregistrer ici.",
    welcome_back: "Bon retour",
    profile_title: "Modifier le Profil",
    profile_locked_note: "Le nom et l'email ne peuvent pas être modifiés ici.",
    save_profile: "Enregistrer",
    disclaimer_title: "Avertissement",
    disclaimer_text: "Les plans NutriCrew sont générés par IA et sont fournis à titre informatif uniquement. Nous ne sommes pas des nutritionnistes ou diététiciens agréés. Consultez un professionnel de santé qualifié avant d'apporter des changements importants à votre alimentation.",
    calorie_disclaimer: "Estimations seulement — pas un avis médical.",
    plan_loading: "Préparation de votre plan nutritionnel...",
    plan_error: "La cuisine est temporairement indisponible. Vérifiez votre connexion et réessayez.",
    calorie_error: "Impossible d'atteindre la cuisine. Vérifiez votre connexion.",
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
    step_airplane_meal: "Que Mangerez-Vous Dans l'Avion?",
    airplane_meal_plan_placeholder: "ex. poulet avec riz et salade, petit pain, jus, gâteau au chocolat...",
    airplane_meal_plan_skip: "Passer — Je déciderai dans l'avion",
    airplane_meal_plan_hint: "Dites-nous ce qu'il y a au menu pour que l'IA puisse planifier en conséquence. Optionnel.",
    roster_btn: "Planning Mensuel",
    roster_fab: "Planning",
    roster_title: "Importer Votre Planning",
    roster_hint: "Prenez 1–2 captures d'écran de votre planning mensuel. L'IA lit le programme et génère un plan repas avant chaque pairing automatiquement.",
    roster_upload_btn: "Choisir des Photos",
    roster_parsing: "Lecture du planning…",
    roster_confirm_title: "Pairings Trouvés",
    roster_confirm_hint: "Vérifiez les pairings ci-dessous et confirmez pour planifier vos repas.",
    roster_confirm_btn: "Planifier Tous les Repas",
    roster_saving: "Enregistrement…",
    roster_done_title: "Votre Mois est Planifié!",
    roster_done_subtitle: "Voici ce qui vous attend:",
    roster_done_flow: "24h avant → Choisissez votre cuisine → Plan repas prêt",
    roster_done_btn: "Terminé",
    gym_plan_btn: "Voir Mon Plan Gym",
    gym_plan_fab: "Plan Gym",
    gym_plan_none_msg: "Pas encore de plan gym ce mois-ci. Importez votre planning pour en générer un.",
    gym_plan_title: "Plan Gym du Mois",
    gym_plan_rest: "Repos",
    gym_plan_watch: "Voir",
    roster_no_pairings: "Aucun pairing à venir trouvé. Assurez-vous que la photo montre des dates futures.",
    roster_error: "Impossible de lire le planning. Essayez une photo plus nette.",
    roster_home_base: "Ville de Base",
    roster_home_base_placeholder: "ex. Miami, Londres, Paris…",
    roster_edit: "Modifier",
    roster_delete: "Supprimer",
    roster_save_edit: "Enregistrer",
    roster_cancel_edit: "Annuler",
    roster_add_pairing: "+ Ajouter Pairing",
    roster_going_usa: "Vers les États-Unis?",
    roster_dest_label: "Destinations (séparées par virgule)",
    roster_depart_label: "Date Départ (AAAA-MM-JJ)",
    roster_return_label: "Date Retour (AAAA-MM-JJ)",
    roster_confirm_all: "Tout Correct — Planifier",
    step_duty: "Votre Planning Service",
    duty_report: "Heure de Présentation",
    duty_length: "Durée de Service",
    duty_layover: "Type d'Escale",
    layover_short: "Court  ≤8h",
    layover_standard: "Standard 8–24h",
    layover_long: "Long  24h+",
    duty_direction: "Direction du Vol",
    dir_east: "Vers l'Est",
    dir_west: "Vers l'Ouest",
    dir_ns: "Nord/Sud",
    duty_skip: "Ignorer — pairing standard",
    tab_performance: "Performance",
    perf_advisory_title: "Avis Performance de Service",
    perf_badge: "🧠 Mode Cognitif",
    val_enter_name: "Entrez votre nom pour continuer.",
    val_enter_email: "Entrez votre email pour continuer.",
    val_select_one: "Choisissez une option pour continuer.",
    val_enter_weight: "Entrez votre poids pour continuer.",
    val_select_dob: "Sélectionnez votre date de naissance pour continuer.",
    val_dob_young: "Vous devez avoir au moins 16 ans pour utiliser NutriCrew.",
    val_dob_old: "Vous devez avoir 80 ans ou moins pour continuer.",
    val_select_kitchen: "Sélectionnez au moins une option de cuisine pour continuer.",
    val_select_diet: "Sélectionnez au moins un régime pour continuer.",
    val_diet_describe: "Décrivez votre régime ci-dessus pour continuer.",
    val_select_goal: "Choisissez au moins un objectif pour continuer.",
    val_enter_budget: "Entrez votre budget pour continuer.",
    val_select_days: "Choisissez la durée de votre pairing pour continuer.",
    val_fill_dest: "Remplissez toutes les destinations pour continuer.",
    val_select_usa: "Sélectionnez oui ou non pour continuer.",
    hydration_target: "Objectif Hydratation Journalier",
    hydration_longhauul: "Vol long-courrier — l'altitude déshydrate plus vite",
    hydration_medium: "Vol moyen-courrier — buvez plus qu'au sol",
    hydration_domestic: "Buvez régulièrement tout au long de votre service",
    share_btn: "Partager le Plan",
    share_copied: "Lien copié dans le presse-papiers !",
    share_title: "Mon Plan Nutritionnel NutriCrew",
    share_text: "Découvrez mon plan nutritionnel d'équipage NutriCrew !",
    referral_title: "Inviter l'Équipage",
    referral_desc: "Partagez votre lien — vous recevez tous les deux un pairing gratuit.",
    referral_copy: "Copier le Lien",
    referral_copied: "Copié !",
    referral_applied: "Parrainage appliqué — vous obtenez un pairing gratuit !",
  },
  es: {
    tagline: "Combustible Para Tu Vuelo",
    tagline_sub: "Nutrición, jet lag y planificación de comidas para tripulaciones de vuelo",
    contact_us: "¿Preguntas? Contáctanos",
    faq_title: "FAQ",
    faq_heading: "Preguntas Frecuentes",
    start: "Comenzar Check-In",
    step_lang: "Seleccionar Idioma",
    step_name: "Nombre Completo",
    step_email: "Correo Electrónico",
    step_gender: "Género",
    step_weight: "Peso",
    step_age: "Fecha de Nacimiento",
    step_position: "Tu Rol",
    step_pairing: "Duración del Pairing",
    step_route: "Tu Ruta",
    destination_label: "Destino",
    step_usa: "¿Vuelo a EE.UU.?",
    step_kitchen: "Acceso a Cocina",
    step_lunch_bag: "Tamaño del Bolso",
    bag_small: "Pequeño — 1–2 recipientes (~4L)",
    bag_medium: "Mediano — 2–3 recipientes (~6L)",
    bag_large: "Grande  — 3–4 recipientes + extras (~10L)",
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
    microwave: "Solo Microondas", fridge: "Refrigerador, Sin Estufa", airplane_food: "Comida de Avión Incluida",
    step_cooking_pref: "Preferencia de Cocina", cooking_enjoy: "Me Gusta Cocinar", cooking_simple: "Necesito Recetas Simples",
    no_restrictions: "Sin Restricciones", vegetarian: "Vegetariano",
    vegan: "Vegano", gluten_free: "Sin Gluten", halal: "Halal",
    kosher: "Kosher", low_carb: "Bajo en Carbohidratos",
    dairy_free: "Sin Lácteos", mediterranean: "Mediterráneo", carnivore: "Carnívoro",
    paleo: "Paleo", calorie_deficit: "Déficit Calórico ⭐",
    diet_other: "Otra", diet_other_placeholder: "Cuéntanos sobre tu dieta...",
    allergies_section: "Alergias & Intolerancias",
    nut_free: "Sin Frutos Secos", egg_free: "Sin Huevo", shellfish_free: "Sin Mariscos",
    soy_free: "Sin Soja", lactose_free: "Sin Lactosa", fodmap: "Bajo-FODMAP",
    offline_banner: "Sin conexión — mostrando el último plan guardado",
    offline_generate: "Sin conexión — generar un nuevo plan requiere internet.",
    history_btn: "Historial", history_title: "Historial de planes",
    history_empty: "Aún no hay planes guardados. Genera tu primer plan para verlo aquí.",
    history_open: "Abrir",
    feedback_prompt: "¿Cómo funcionó este plan?",
    feedback_energy: "Energía", feedback_satiety: "Saciedad", feedback_jetlag: "Jet Lag",
    feedback_comment_placeholder: "¿Algún comentario? ¿Qué funcionó o no... (opcional)",
    feedback_submit: "Enviar Opinión", feedback_thanks: "¡Gracias por tu opinión!",
    lose_weight: "Perder Peso", keep_weight: "Mantener Peso", gain_weight: "Ganar Peso",
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
    jetlag_fab: "Jet Lag",
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
    airplane_meal_error: "No se pudo revisar esa comida ahora. Inténtalo de nuevo.",
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
    try_again: "Intentar de Nuevo",
    view_last_plan: "Ver Último Plan",
    saved_meals_title: "Comidas Guardadas",
    saved_fab: "Guardados",
    saved_meals_empty: "Aún no hay comidas guardadas. Toca el corazón en cualquier comida para guardarla aquí.",
    welcome_back: "Bienvenido de vuelta",
    profile_title: "Editar Perfil",
    profile_locked_note: "El nombre y el correo no se pueden cambiar aquí.",
    save_profile: "Guardar Cambios",
    disclaimer_title: "Aviso Legal",
    disclaimer_text: "Los planes de NutriCrew son generados por IA y son solo para fines informativos. No somos nutricionistas ni dietistas certificados. Consulta a un profesional de la salud calificado antes de hacer cambios importantes en tu dieta.",
    calorie_disclaimer: "Solo estimaciones — no es un consejo médico.",
    plan_loading: "Preparando tu plan nutricional...",
    plan_error: "La cocina no está disponible ahora. Revisa tu conexión y toca Reintentar.",
    calorie_error: "No se pudo alcanzar la cocina. Revisa tu conexión.",
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
    step_airplane_meal: "¿Qué Comerás en el Avión?",
    airplane_meal_plan_placeholder: "ej. pollo con arroz y ensalada, panecillo, jugo, pastel de chocolate...",
    airplane_meal_plan_skip: "Omitir — Lo decidiré en el vuelo",
    airplane_meal_plan_hint: "Dinos qué hay en el menú para que la IA planifique mejor. Opcional.",
    roster_btn: "Roster Mensual",
    roster_fab: "Roster",
    roster_title: "Subir Tu Roster",
    roster_hint: "Toma 1–2 capturas de tu roster mensual. La IA lee el horario y genera un plan de comidas antes de cada pairing automáticamente.",
    roster_upload_btn: "Elegir Fotos",
    roster_parsing: "Leyendo tu roster…",
    roster_confirm_title: "Pairings Encontrados",
    roster_confirm_hint: "Revisa los pairings a continuación y confirma para programar tus planes.",
    roster_confirm_btn: "Programar Todos los Planes",
    roster_saving: "Guardando…",
    roster_done_title: "¡Tu Mes está Programado!",
    roster_done_subtitle: "Esto es lo que te espera:",
    roster_done_flow: "24h antes → Elige tu cocina → Plan de comidas listo",
    roster_done_btn: "Hecho",
    gym_plan_btn: "Ver Mi Plan de Gym",
    gym_plan_fab: "Plan Gym",
    gym_plan_none_msg: "Aún no hay plan de gym este mes. Sube tu roster para generar uno.",
    gym_plan_title: "Plan de Gym del Mes",
    gym_plan_rest: "Descanso",
    gym_plan_watch: "Ver",
    roster_no_pairings: "No se encontraron pairings futuros. Asegúrate de que la foto muestre fechas futuras.",
    roster_error: "No se pudo leer el roster. Intenta con una foto más clara.",
    roster_home_base: "Tu Ciudad Base",
    roster_home_base_placeholder: "ej. Miami, Londres, París…",
    roster_edit: "Editar",
    roster_delete: "Eliminar",
    roster_save_edit: "Guardar",
    roster_cancel_edit: "Cancelar",
    roster_add_pairing: "+ Agregar Pairing",
    roster_going_usa: "¿Va a EE. UU.?",
    roster_dest_label: "Destinos (separados por coma)",
    roster_depart_label: "Fecha Salida (AAAA-MM-DD)",
    roster_return_label: "Fecha Regreso (AAAA-MM-DD)",
    roster_confirm_all: "Todo Correcto — Programar",
    step_duty: "Tu Horario de Servicio",
    duty_report: "Hora de Presentación",
    duty_length: "Duración de Servicio",
    duty_layover: "Tipo de Escala",
    layover_short: "Corta  ≤8h",
    layover_standard: "Estándar 8–24h",
    layover_long: "Larga  24h+",
    duty_direction: "Dirección del Vuelo",
    dir_east: "Hacia el Este",
    dir_west: "Hacia el Oeste",
    dir_ns: "Norte/Sur",
    duty_skip: "Omitir — pairing estándar",
    tab_performance: "Rendimiento",
    perf_advisory_title: "Aviso de Rendimiento de Servicio",
    perf_badge: "🧠 Modo Cognitivo",
    val_enter_name: "Ingresa tu nombre para continuar.",
    val_enter_email: "Ingresa tu correo para continuar.",
    val_select_one: "Elige una opción para continuar.",
    val_enter_weight: "Ingresa tu peso para continuar.",
    val_select_dob: "Selecciona tu fecha de nacimiento para continuar.",
    val_dob_young: "Debes tener al menos 16 años para usar NutriCrew.",
    val_dob_old: "Debes tener 80 años o menos para continuar.",
    val_select_kitchen: "Selecciona al menos una opción de cocina para continuar.",
    val_select_diet: "Selecciona al menos una opción de dieta para continuar.",
    val_diet_describe: "Describe tu dieta arriba para continuar.",
    val_select_goal: "Elige al menos un objetivo para continuar.",
    val_enter_budget: "Ingresa tu presupuesto para continuar.",
    val_select_days: "Elige la duración de tu pairing para continuar.",
    val_fill_dest: "Completa todos los destinos para continuar.",
    val_select_usa: "Selecciona sí o no para continuar.",
    hydration_target: "Objetivo Diario de Hidratación",
    hydration_longhauul: "Vuelo de largo recorrido — la altitud de cabina deshidrata más rápido",
    hydration_medium: "Vuelo de medio recorrido — bebe más que en tierra",
    hydration_domestic: "Mantén una hidratación constante durante tu servicio",
    share_btn: "Compartir Plan",
    share_copied: "¡Enlace copiado al portapapeles!",
    share_title: "Mi Plan Nutricional NutriCrew",
    share_text: "¡Mira mi plan de nutrición de tripulación de NutriCrew!",
    referral_title: "Invitar Tripulación",
    referral_desc: "Comparte tu enlace — ambos reciben un pairing extra gratis.",
    referral_copy: "Copiar Enlace",
    referral_copied: "¡Copiado!",
    referral_applied: "¡Referido aplicado — obtienes un pairing extra gratis!",
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
  <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
    <path d="M11 2C6.5 2 3 5.5 3 10c0 5 8 12 8 12s8-7 8-12c0-4.5-3.5-8-8-8z" stroke={C.gold} strokeWidth="1.5" fill="none"/>
    <path d="M11 7v4l3 3" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const JetlagIcon = () => (
  <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="8" stroke={C.gold} strokeWidth="1.5" fill="none"/>
    <path d="M11 6.5v4.5l3 2" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 2v1.5M11 19.5V21M2 11h1.5M18.5 11H20" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Bookmark, not a heart — a heart here would be confused with the per-meal
// favorite toggle inside each meal card, which is a separate action.
const SavedMealsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
    <path d="M6 3.5h10a1 1 0 0 1 1 1V19l-6-3.5L5 19V4.5a1 1 0 0 1 1-1z" stroke={C.gold} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
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

function urlBase64ToUint8Array(base64String) {
  // Strip any non-base64 characters (newlines, BOM, zero-width Unicode from copy-paste)
  const cleaned = (base64String || "").trim().replace(/[^A-Za-z0-9\-_+/=]/g, '');
  const padding = '='.repeat((4 - (cleaned.length % 4)) % 4);
  const base64 = (cleaned + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

// Module-level flag — push registration must only ever be attempted once per
// browser session. The useEffect below depends on user?.email which changes on
// every keystroke in the email check-in field, so without this guard we'd fire
// concurrent SW registration + Notification.requestPermission() calls for every
// character typed, freezing the browser.
let pushRegistrationDone = false;

const storage = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};

const PAIRING_COUNT_KEY = "nutricrew_pairing_count";
const PENDING_PAIRING_KEY = "nutricrew_pending_pairing";
const FAVORITES_KEY = "nutricrew_favorites";
const USER_KEY = "nutricrew_user";
const SESSION_KEY = "nutricrew_session";
const PASSWORD_PROMPT_DISMISSED_KEY = "nutricrew_password_prompt_dismissed";
const SAVED_PLANS_KEY = "nutricrew_saved_plans";
const FEEDBACK_KEY = "nutricrew_plan_feedback";
const CHECKIN_DRAFT_KEY = "nutricrew_checkin_draft";
const PENDING_REFERRAL_KEY = "nutricrew_pending_referral";
const MAX_SAVED_PLANS = 10;

// Capture ?ref=CODE from the URL immediately on load so it survives navigation/login.
(function capturePendingReferral() {
  try {
    const p = new URLSearchParams(window.location.search);
    const ref = p.get("ref");
    if (ref && ref.length === 8) {
      storage.set(PENDING_REFERRAL_KEY, ref.toUpperCase());
      // Clean the URL so it doesn't re-apply on subsequent visits
      const clean = window.location.pathname + (p.toString().replace(/[?&]?ref=[^&]*/g, "").replace(/^&/, "?").replace(/^/, p.size > 1 ? "?" : ""));
      window.history.replaceState({}, "", clean);
    }
  } catch {}
})();

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

function getPlanFeedback(planKey) {
  const all = storage.get(FEEDBACK_KEY) || [];
  return all.find(f => f.planKey === planKey) || null;
}

function savePlanFeedback(planKey, feedback) {
  const all = (storage.get(FEEDBACK_KEY) || []).filter(f => f.planKey !== planKey);
  storage.set(FEEDBACK_KEY, [{ planKey, ...feedback, submittedAt: Date.now() }, ...all].slice(0, 50));
}

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);
  return isOnline;
}

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function NutriCrew() {
  const isOnline = useOnlineStatus();
  const [user, setUser] = useState(() => storage.get(USER_KEY));
  const [lang, setLang] = useState(() => user?.lang || "en");
  const [screen, setScreen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("premium") === "true") return "premium";
    // Offline with a saved plan: bypass auth flow and show the plan immediately.
    if (!navigator.onLine && getSavedPlans().length > 0) return "plan";
    if (storage.get(SESSION_KEY)?.token) {
      // If we already have a cached user profile, skip the loading spinner and
      // render immediately — verify-session will update isPremium in background.
      if (storage.get(USER_KEY)?.email) {
        // Resume in-progress onboarding if a draft was saved at step ≥ 1.
        if ((storage.get(CHECKIN_DRAFT_KEY)?.step ?? 0) >= 1) return "checkin";
        return "splash";
      }
      return "loading";
    }
    // No session token. A first-time user who got interrupted mid-checkin (app
    // backgrounded/reloaded right after typing name+email) also has USER_KEY.email
    // set at this point, even though they never signed up — resume their draft
    // instead of throwing them onto an unexpected sign-in wall.
    if ((storage.get(CHECKIN_DRAFT_KEY)?.step ?? 0) >= 1) return "checkin";
    if (storage.get(USER_KEY)?.email) return "login"; // returning user, session expired
    return "splash"; // first time — show the welcome screen before check-in
  }); // login | otp | set-password | loading | splash | checkin | boarding | plan | premium
  const [pendingOtpEmail, setPendingOtpEmail] = useState("");
  const [step, setStep] = useState(() => storage.get(CHECKIN_DRAFT_KEY)?.step ?? 0);
  const [pairing, setPairing] = useState(() => {
    const pending = storage.get(PENDING_PAIRING_KEY);
    if (pending) {
      storage.set(PENDING_PAIRING_KEY, null);
      return pending;
    }
    if (!navigator.onLine) {
      const saved = getSavedPlans()[0];
      if (saved) return saved.data;
    }
    const draft = storage.get(CHECKIN_DRAFT_KEY);
    if (draft?.pairing) return draft.pairing;
    return {};
  });
  const [plan, setPlan] = useState(() => {
    if (!navigator.onLine) {
      const saved = getSavedPlans()[0];
      if (saved) return saved.plan;
    }
    return null;
  });
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
  // Reactive, not frozen at mount — a user who completes their profile this
  // session (first-time signup) must immediately count as returning so the
  // splash screen's Roster/Gym Plan entry point appears without a reload.
  const returningUser = !!(user?.gender && user?.weight && (user?.dob || user?.age) && user?.position);
  // Separate from returningUser above: that one is live so the splash screen
  // updates immediately. This one is a snapshot taken when the checkin flow
  // starts — without it, finishing the profile questions mid-flow would flip
  // returningUser to true and yank the step list shorter while the user is
  // still answering it, skipping kitchen/diet/goals/budget on a first run.
  const [checkinReturning, setCheckinReturning] = useState(() => {
    const draft = storage.get(CHECKIN_DRAFT_KEY);
    return draft?.checkinReturning ?? returningUser;
  });
  const [showRoster, setShowRoster] = useState(false);
  const [showGymPlan, setShowGymPlan] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [referralCode, setReferralCode] = useState(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [premiumReturnScreen, setPremiumReturnScreen] = useState("boarding");

  const openRoster = (fromScreen) => {
    setPremiumReturnScreen(fromScreen);
    if (!isPremium) { setScreen("premium"); return; }
    setShowRoster(true);
  };

  const openGymPlan = (fromScreen) => {
    setPremiumReturnScreen(fromScreen);
    if (!isPremium) { setScreen("premium"); return; }
    setShowGymPlan(true);
  };

  // The "your plan is ready" email/push links land here with ?plan=1 — that's
  // an explicit request to see the plan, so it must win even if a previous
  // open already marked the plan viewed (e.g. a push notification got there
  // first). Without forcePlanOpen, only show it once (normal splash landing).
  const [forcePlanOpen] = useState(() => new URLSearchParams(window.location.search).get("plan") === "1");
  useEffect(() => {
    if (forcePlanOpen) window.history.replaceState({}, "", window.location.pathname);
  }, [forcePlanOpen]);

  // A roster-automation plan was generated with no app session involved, so
  // there's no in-app state pointing at it yet. As soon as routing settles on
  // splash (profile + auth already resolved), jump straight into it — the
  // person tapped a link specifically to see this plan, so land them on it
  // directly instead of making them find a button.
  useEffect(() => {
    if (screen !== "splash" || !user?.email) return;
    fetch(`${API_BASE}/api/roster/latest-plan?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(d => {
        if (!d.found || (d.viewedAt && !forcePlanOpen)) return;
        setPlan(d.plan);
        setPairing(prev => ({ ...prev, ...d.pairing }));
        setActiveTab("plan");
        setActiveDay(0);
        setScreen("plan");
        fetch(`${API_BASE}/api/roster/mark-plan-viewed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmToken: d.confirmToken }),
        }).catch(() => {});
      })
      .catch(() => {});
  }, [screen, user?.email, forcePlanOpen]);

  // Register push notifications only when the user reaches the plan screen —
  // never during check-in. Triggering on user?.email caused navigator.serviceWorker
  // .ready to resolve mid-flow and show the Notification permission bar while the
  // user was clicking through steps, making the tab appear frozen.
  useEffect(() => {
    if (screen !== "plan" || !user?.email || pushRegistrationDone) return;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidKey || vapidKey.length < 80) return;
    pushRegistrationDone = true;
    const email = user.email; // capture before async work to avoid stale closure
    (async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;
        const existing = await reg.pushManager.getSubscription();
        const sub = existing || await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
        await fetch(`${API_BASE}/api/push/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, subscription: sub.toJSON() }),
        });
      } catch (e) {
        console.warn('Push registration failed:', e.message);
      }
    })();
  }, [screen, user?.email]); // eslint-disable-line

  // Persist in-progress check-in so a refresh or return resumes at the same step.
  useEffect(() => {
    if (screen !== "checkin") return;
    storage.set(CHECKIN_DRAFT_KEY, { step, pairing, checkinReturning });
  }, [screen, step, pairing, checkinReturning]); // eslint-disable-line

  useEffect(() => {
    const sess = storage.get(SESSION_KEY);
    const hasProfile = !!storage.get(USER_KEY)?.email;
    if (!sess?.token) { setScreen(s => s === "loading" ? (hasProfile ? "login" : "splash") : s); return; }
    fetch(`${API_BASE}/api/auth/verify-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: sess.token }),
    })
      .then(async r => {
        if (r.ok) {
          const data = await r.json();
          setUser(prev => {
            const u = prev?.email
              ? { ...prev, isPremium: !!data.isPremium, bonusPairings: data.bonusPairings ?? prev?.bonusPairings ?? 0 }
              : { email: data.email, name: data.name || "", isPremium: !!data.isPremium, bonusPairings: data.bonusPairings ?? 0 };
            storage.set(USER_KEY, u);
            return u;
          });
          setScreen(s => s === "loading" ? "splash" : s);
        } else {
          // Auth failure (401/403) — session is genuinely invalid; redirect to login.
          storage.set(SESSION_KEY, null);
          setScreen(storage.get(USER_KEY)?.email ? "login" : "splash");
        }
      })
      .catch(() => {
        // Network error or Render cold-start timeout — don't boot the user.
        // If they were on "loading", fall back to splash/login from localStorage.
        setScreen(s => s === "loading" ? (storage.get(USER_KEY)?.email ? "login" : "splash") : s);
      });
  }, []); // eslint-disable-line

  const t = T[lang];

  const FREE_PAIRING_LIMIT = 1;

  // Detect successful Stripe return (?premium=true in URL)
  const [premiumSuccess] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("premium") === "true") {
      window.history.replaceState({}, "", window.location.pathname);
      storage.set(PAIRING_COUNT_KEY, 0);
      return true;
    }
    return false;
  });

  // Navigate to the premium success screen once the app finishes loading.
  const premiumNavDone = useRef(false);
  useEffect(() => {
    if (!premiumSuccess || premiumNavDone.current || screen === "loading") return;
    premiumNavDone.current = true;
    // If no active pairing exists, "Continue" should go back to splash rather
    // than the boarding pass (which would be empty).
    if (!pairing?.pairing_days && !pairing?.departure) setPremiumReturnScreen("splash");
    setScreen("premium");
  }, [premiumSuccess, screen]); // eslint-disable-line

  // Poll verify-session after a Stripe payment until the webhook has written
  // isPremium=true to MongoDB (webhook fires ~1–3s after redirect; page may
  // load before it arrives). Persists to localStorage so next open is seamless.
  useEffect(() => {
    if (!premiumSuccess) return;
    const sess = storage.get(SESSION_KEY);
    if (!sess?.token) return;
    let cancelled = false;
    let attempts = 0;
    const poll = async () => {
      if (cancelled || attempts >= 6) return;
      attempts++;
      try {
        const r = await fetch(`${API_BASE}/api/auth/verify-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: sess.token }),
        });
        if (r.ok) {
          const data = await r.json();
          if (data.isPremium) {
            setUser(prev => {
              const u = prev?.email
                ? { ...prev, isPremium: true }
                : { email: data.email, name: data.name || "", isPremium: true };
              storage.set(USER_KEY, u);
              return u;
            });
            return;
          }
        }
      } catch {}
      setTimeout(poll, 2000);
    };
    setTimeout(poll, 1500); // First check after 1.5s — webhook needs ~1s to fire
    return () => { cancelled = true; };
  }, []); // eslint-disable-line

  const pairingCount = storage.get(PAIRING_COUNT_KEY) || 0;
  const bonusPairings = user?.bonusPairings || 0;
  const isPremiumNeeded = premiumSuccess ? false : pairingCount >= FREE_PAIRING_LIMIT + bonusPairings;
  // Real subscription status (server-authoritative) — true right after Stripe
  // checkout returns, or once verify-session/login confirms it from the DB.
  const isPremium = premiumSuccess || !!user?.isPremium;

  // ── STEP DEFINITIONS (check-in flow) ──────────────────────────
  // If returning user, skip personal steps.
  // Calorie Deficit diet injects an extra step to collect the calorie target.
  // Profile questions (name through budget) describe the person, not the
  // trip — answered once, then only editable via the profile icon. Only
  // pairing_days onward (plus the airplane meal description, which depends
  // on what catering THIS specific flight has) varies trip to trip.
  const numPairingDays = parseInt(pairing.pairing_days, 10) || 1;
  const kitchenDaySteps = Array.from({ length: numPairingDays }, (_, i) => `kitchen_day_${i + 1}`);
  const anyDayHasAirplaneFood = kitchenDaySteps.some(s => (pairing[s] || []).includes("airplane_food"));
  const allSteps = [
    "name", "email", "gender", "weight", "dob", "position",
    "lunch_bag", "cooking_pref", "diet",
    ...((pairing.diets || user?.diets || []).includes("calorie_deficit") ? ["calorie_target"] : []),
    "goals", "budget",
    "pairing_days", "departure", "destination",
    ...kitchenDaySteps,
    "going_usa", "duty_schedule",
    ...(anyDayHasAirplaneFood ? ["airplane_meal_plan"] : []),
  ];
  const personalSteps = ["name","email","gender","weight","dob","position","lunch_bag","cooking_pref","diet","calorie_target","goals","budget"];
  const steps = checkinReturning
    ? allSteps.filter(s => !personalSteps.includes(s))
    : allSteps;

  const currentStep = steps[step];
  const totalSteps = steps.length;

  // Kitchen, lunch_bag, cooking_pref, diets/diet_other, calorie target, goals,
  // budget, and departure are profile data — mirror them into the user profile
  // so they're never re-asked. departure is a home-airport — crews almost
  // always depart from the same airport every pairing.
  const PROFILE_FIELDS = ["lunch_bag", "cooking_pref", "diets", "diet_other", "calorie_target", "calorie_deficit_amount", "calorie_deficit_preset", "goals", "budget_type", "budget_amount", "departure"];
  const upd = (k, v) => {
    setPairing(p => ({ ...p, [k]: v }));
    if (PROFILE_FIELDS.includes(k)) {
      setUser(prev => {
        const updated = { ...(prev || {}), [k]: v };
        storage.set(USER_KEY, updated);
        return updated;
      });
    }
  };

  const handleUpgrade = async (plan = "monthly") => {
    const email = user?.email || pairing?.email;
    if (!email) return;
    storage.set(PENDING_PAIRING_KEY, pairing);
    const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, plan }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.url) {
      window.location.href = data.url;
    } else {
      storage.set(PENDING_PAIRING_KEY, null);
      throw new Error(data.error || "Could not start checkout");
    }
  };

  const handleContinue = () => {
    if (step < totalSteps - 1) {
      startTransition(() => setStep(s => s + 1));
    } else {
      // Show boarding pass before generating
      setScreen("boarding");
    }
  };

  const handleBack = () => {
    if (step > 0) startTransition(() => setStep(s => s - 1));
    else { storage.set(CHECKIN_DRAFT_KEY, null); setScreen("splash"); }
  };

  const mergedDiets = pairing.diets?.length ? pairing.diets : (user?.diets || []);
  const needsPremiumForDiet = mergedDiets.includes("calorie_deficit") && !isPremium;

  const handleGenerate = async () => {
    if (!isOnline) return; // blocked by UI; boarding pass shows offline banner
    if (isPremiumNeeded || needsPremiumForDiet) { setScreen("premium"); return; }
    setScreen("plan");

    // Strip empty arrays so a stale draft (e.g. goals: []) doesn't silently
    // overwrite the user's saved profile values from a prior session.
    const cleanPairing = Object.fromEntries(
      Object.entries(pairing).filter(([, v]) => !(Array.isArray(v) && v.length === 0))
    );
    const data = { ...user, ...cleanPairing };
    // Build per-day kitchen array; fall back to legacy data.kitchen if not set
    const nDays = parseInt(data.pairing_days, 10) || 1;
    data.kitchen_by_day = Array.from({ length: nDays }, (_, i) =>
      data[`kitchen_day_${i + 1}`] || data.kitchen || []
    );
    data.kitchen = data.kitchen_by_day[0];
    const cacheKey = planCacheKey(data, lang);
    const cached = findSavedPlan(cacheKey);
    if (cached) {
      storage.set(CHECKIN_DRAFT_KEY, null);
      setPlan(cached.plan);
      return;
    }

    setLoading(true);
    try {
      const result = await generatePlan(data, lang);
      setPlan(result);
      storage.set(PAIRING_COUNT_KEY, result.pairingCount ?? pairingCount + 1);
      if (!result.failedDays?.length) {
        saveSavedPlan(cacheKey, data, result);
        storage.set(CHECKIN_DRAFT_KEY, null);
      }
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

  const handleShare = async () => {
    const email = user?.email;
    // Lazily fetch referral code on first share tap
    let code = referralCode;
    if (!code && email) {
      try {
        const r = await fetch(`${API_BASE}/api/referral/code?email=${encodeURIComponent(email)}`);
        if (r.ok) { const d = await r.json(); code = d.referralCode; setReferralCode(code); }
      } catch {}
    }
    const origin = window.location.origin;
    const shareUrl = code ? `${origin}/?ref=${code}` : origin;
    const shareText = t.share_text;
    if (navigator.share) {
      try {
        await navigator.share({ title: t.share_title, text: shareText, url: shareUrl });
        return;
      } catch (e) {
        if (e.name === "AbortError") return; // user cancelled — no fallback needed
      }
    }
    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    } catch {}
  };

  const openReferralModal = async () => {
    const email = user?.email;
    if (!email) return;
    if (!referralCode) {
      try {
        const r = await fetch(`${API_BASE}/api/referral/code?email=${encodeURIComponent(email)}`);
        if (r.ok) { const d = await r.json(); setReferralCode(d.referralCode); }
      } catch {}
    }
    setShowReferral(true);
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
    storage.set(CHECKIN_DRAFT_KEY, null);
    setPairing({});
    setPlan(null);
    setStep(0);
    setActiveTab("plan");
    setActiveDay(0);
    setCheckinReturning(returningUser);
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

  const viewPlan = (saved) => {
    setPairing(saved.data);
    setPlan(saved.plan);
    setActiveTab("plan");
    setActiveDay(0);
    setScreen("plan");
  };

  const handleLoginSuccess = (sessionData) => {
    storage.set(SESSION_KEY, { token: sessionData.token, email: sessionData.email });
    const hasPassword = sessionData.hasPassword !== false;
    setUser(prev => {
      const u = prev?.email
        ? { ...prev, isPremium: !!sessionData.isPremium, hasPassword, bonusPairings: sessionData.bonusPairings ?? prev?.bonusPairings ?? 0 }
        : { email: sessionData.email, name: sessionData.name || "", isPremium: !!sessionData.isPremium, hasPassword, bonusPairings: sessionData.bonusPairings ?? 0 };
      storage.set(USER_KEY, u);
      return u;
    });
    // Apply any pending referral code — fire-and-forget, non-blocking
    const pendingRef = storage.get(PENDING_REFERRAL_KEY);
    if (pendingRef && sessionData.email) {
      storage.set(PENDING_REFERRAL_KEY, null);
      fetch(`${API_BASE}/api/referral/use`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sessionData.email, referralCode: pendingRef }),
      }).then(r => r.json()).then(d => {
        if (d.success) {
          setUser(prev => {
            const u = { ...(prev || {}), bonusPairings: (prev?.bonusPairings || 0) + 1 };
            storage.set(USER_KEY, u);
            return u;
          });
        }
      }).catch(() => {});
    }
    if (!hasPassword) {
      setScreen("set-password");
    } else {
      setScreen("splash");
    }
  };

  // ── RENDER ────────────────────────────────────────────────────
  return (
    <div style={styles.root}>
      {/* Background grid lines (aviation aesthetic) */}
      <div style={styles.gridOverlay}/>

      {screen === "loading" && <LoadingScreen />}

      {screen === "login" && (
        <LoginScreen
          onSent={(email) => { setPendingOtpEmail(email); setScreen("otp"); }}
          onSuccess={handleLoginSuccess}
        />
      )}

      {screen === "otp" && (
        <OTPScreen
          email={pendingOtpEmail}
          onSuccess={handleLoginSuccess}
          onBack={() => setScreen("login")}
        />
      )}

      {screen === "set-password" && (
        <SetPasswordScreen
          email={user?.email}
          onDone={() => { updateProfile({ hasPassword: true }); setScreen("splash"); }}
        />
      )}

      {screen === "splash" && (
        <SplashScreen t={t} lang={lang} setLang={setLang}
          returningUser={returningUser} user={user} isPremium={isPremium}
          hasSavedPlan={getSavedPlans().length > 0}
          onStart={() => { setCheckinReturning(returningUser); setScreen("checkin"); }}
          onNewPairing={startNewPairing}
          onOpenHistory={() => setShowHistory(true)}
          onOpenSavedMeals={() => setShowSavedMeals(true)}
          onOpenProfile={() => setShowProfile(true)}
          onOpenRoster={() => openRoster("splash")}
          onOpenReferral={openReferralModal}
          onOpenFAQ={() => setShowFAQ(true)}
        />
      )}

      {showHistory && (
        <PlanHistoryModal t={t} onClose={() => setShowHistory(false)} onOpen={(saved) => { setShowHistory(false); viewPlan(saved); }} />
      )}

      {showReferral && (
        <ReferralModal
          t={t}
          referralCode={referralCode}
          onClose={() => setShowReferral(false)}
        />
      )}

      {showFAQ && (
        <FAQModal t={t} lang={lang} onClose={() => setShowFAQ(false)} />
      )}

      {showRoster && (
        <RosterModal t={t} user={user} onClose={() => setShowRoster(false)} onRequirePremium={() => { setShowRoster(false); setScreen("premium"); }} />
      )}

      {screen === "checkin" && (
        <CheckInScreen
          key={currentStep}
          t={t} lang={lang} step={step} totalSteps={totalSteps}
          currentStep={currentStep} pairing={pairing} user={user}
          upd={upd} onContinue={handleContinue} onBack={handleBack}
          setUser={setUser}
        />
      )}

      {screen === "boarding" && (
        <BoardingPassScreen t={t} user={user} pairing={pairing}
          onGenerate={handleGenerate} onBack={() => setScreen("checkin")}
          isPremiumNeeded={isPremiumNeeded || needsPremiumForDiet} isOnline={isOnline}
        />
      )}

      {screen === "plan" && (
        <PlanScreen
          t={t} plan={plan} loading={loading} pairing={pairing}
          user={user} activeTab={activeTab} setActiveTab={setActiveTab}
          activeDay={activeDay} setActiveDay={setActiveDay}
          onNewPairing={startNewPairing} onRetry={handleGenerate} lang={lang}
          favorites={favorites} onToggleFavorite={toggleFavorite}
          onOpenAirplaneMeal={() => setShowAirplaneMeal(true)}
          isPremium={plan?.isPremium ?? false}
          isOnline={isOnline}
          planKey={planCacheKey({ ...user, ...Object.fromEntries(Object.entries(pairing).filter(([, v]) => !(Array.isArray(v) && v.length === 0))) }, lang)}
          onShare={handleShare}
          shareCopied={shareCopied}
          onOpenReferral={openReferralModal}
        />
      )}

      {screen === "premium" && (
        <PremiumScreen t={t} onBack={() => setScreen(premiumReturnScreen)} onUpgrade={handleUpgrade} premiumSuccess={premiumSuccess} onGenerate={handleGenerate} returnScreen={premiumReturnScreen}/>
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
              calorieTarget={pairing.calorie_target || user?.calorie_target}
            />
          )}
          <span style={styles.floatLabelJetlag}>{t.jetlag_fab}</span>
          <button style={styles.floatBtnJetlag} onClick={() => setShowJetlag(true)} aria-label="jet lag info">
            <JetlagIcon/>
          </button>
          <span style={styles.floatBtnJetlagBadge} aria-hidden="true">✈️</span>
          {showJetlag && (
            <JetlagModal
              t={t}
              lang={lang}
              pairing={pairing}
              user={user}
              isPremium={isPremium}
              onClose={() => setShowJetlag(false)}
              onRequirePremium={() => { setShowJetlag(false); setPremiumReturnScreen("plan"); setScreen("premium"); }}
            />
          )}
          <span style={styles.floatLabelSaved}>{t.saved_fab}</span>
          <button style={styles.floatBtnSaved} onClick={() => setShowSavedMeals(true)} aria-label="saved meals">
            <SavedMealsIcon/>
          </button>
        </>
      )}

      {/* Roster/Gym Plan sit higher in the FAB stack, which collides with
          the boarding-pass screen's full-width "Generate My Plan" button —
          only show them once an actual plan is on screen. */}
      {screen === "plan" && (
        <>
          <span style={styles.floatLabelRoster}>{t.roster_fab}</span>
          <button style={styles.floatBtnRoster} onClick={() => openRoster("plan")} aria-label="roster upload">
            📅
          </button>
          {!isPremium && <span style={styles.floatBtnRosterCrown} aria-hidden="true">👑</span>}
          <span style={styles.floatLabelGymPlan}>{t.gym_plan_fab}</span>
          <button style={styles.floatBtnGymPlan} onClick={() => openGymPlan("plan")} aria-label="gym plan">
            💪
          </button>
          {!isPremium && <span style={styles.floatBtnGymPlanCrown} aria-hidden="true">👑</span>}
        </>
      )}

      {showGymPlan && (
        <GymPlanModal t={t} user={user} onClose={() => setShowGymPlan(false)}
          onUploadRoster={() => { setShowGymPlan(false); openRoster("plan"); }} />
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

// ─── LOADING SCREEN ───────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, color: C.gold, letterSpacing: 4, fontWeight: "bold", marginBottom: 16 }}>✈ NUTRICREW</div>
        <div style={{ width: 36, height: 36, border: `3px solid ${C.navyBorder}`, borderTop: `3px solid ${C.gold}`, borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto" }} />
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────
function LoginScreen({ onSent, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const sendCode = async (e) => {
    const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: e }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Failed to sign in. Try again."); return; }
    if (data.alreadyVerified) {
      onSuccess(data); // Email already verified — log in immediately, no code needed
    } else {
      onSent(e); // First time — go to OTP screen
    }
  };

  const handleSend = async () => {
    const e = email.trim().toLowerCase();
    if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    setInfo("");
    try {
      if (password) {
        const res = await fetch(`${API_BASE}/api/auth/login-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: e, password }),
        });
        const data = await res.json();
        if (res.ok) { onSuccess(data); return; }
        if (data.error === "no_password") {
          // No password set yet for this account — fall back to the email code silently.
          setInfo("No password set yet — sending you a one-time code instead.");
          await sendCode(e);
          return;
        }
        setError(data.error || "Incorrect password.");
        return;
      }
      await sendCode(e);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.splash}>
      <div style={{ ...styles.splashInner, maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 28, color: C.gold, letterSpacing: 4, fontWeight: "bold", marginBottom: 6 }}>✈ NUTRICREW</div>
          <div style={{ fontSize: 13, color: C.muted, letterSpacing: 2 }}>CREW NUTRITION</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.navyBorder}`, borderRadius: 16, padding: "28px 24px" }}>
          <div style={{ fontSize: 18, fontWeight: "bold", color: C.white, marginBottom: 6 }}>Sign in</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Enter your email and password. No password yet? Leave it blank and we'll email you a one-time code.</div>

          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>✉️</span>
            <input
              style={styles.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              autoFocus
              autoComplete="email"
            />
          </div>

          <div style={{ ...styles.inputWrap, marginTop: 12 }}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              style={styles.input}
              type="password"
              placeholder="Password (optional)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              autoComplete="current-password"
            />
          </div>

          {info && <div style={{ color: C.gold, fontSize: 13, marginTop: 8 }}>{info}</div>}
          {error && <div style={{ color: "#F87171", fontSize: 13, marginTop: 8 }}>{error}</div>}

          <button style={{ ...styles.primaryBtn, width: "100%", justifyContent: "center", marginTop: 16 }}
            onClick={handleSend} disabled={loading}>
            {loading ? "Signing in…" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SET PASSWORD SCREEN ──────────────────────────────────────────
function SetPasswordScreen({ email, onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    setError("");
    try {
      const sess = storage.get(SESSION_KEY);
      const res = await fetch(`${API_BASE}/api/auth/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, token: sess?.token }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to set password."); return; }
      onDone();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.splash}>
      <div style={{ ...styles.splashInner, maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 28, color: C.gold, letterSpacing: 4, fontWeight: "bold", marginBottom: 6 }}>✈ NUTRICREW</div>
          <div style={{ fontSize: 13, color: C.muted, letterSpacing: 2 }}>CREW NUTRITION</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.navyBorder}`, borderRadius: 16, padding: "28px 24px" }}>
          <div style={{ fontSize: 18, fontWeight: "bold", color: C.white, marginBottom: 6 }}>Set a password</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Skip the email code next time — add a password to your account now.</div>

          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              style={styles.input}
              type="password"
              placeholder="New password (8+ characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              autoComplete="new-password"
            />
          </div>

          <div style={{ ...styles.inputWrap, marginTop: 12 }}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              style={styles.input}
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              autoComplete="new-password"
            />
          </div>

          {error && <div style={{ color: "#F87171", fontSize: 13, marginTop: 8 }}>{error}</div>}

          <button style={{ ...styles.primaryBtn, width: "100%", justifyContent: "center", marginTop: 16 }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving…" : "Set Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── OTP SCREEN ───────────────────────────────────────────────────
function OTPScreen({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);

  useEffect(() => {
    const t = setInterval(() => setResendCooldown(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleVerify = async () => {
    const code = otp.trim();
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError("Please enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid code. Please try again."); return; }
      onSuccess(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    setError("");
    try {
      await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch { /* silent */ }
  };

  return (
    <div style={styles.splash}>
      <div style={{ ...styles.splashInner, maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 28, color: C.gold, letterSpacing: 4, fontWeight: "bold", marginBottom: 6 }}>✈ NUTRICREW</div>
          <div style={{ fontSize: 13, color: C.muted, letterSpacing: 2 }}>CREW NUTRITION</div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.navyBorder}`, borderRadius: 16, padding: "28px 24px" }}>
          <div style={{ fontSize: 18, fontWeight: "bold", color: C.white, marginBottom: 6 }}>Check your email</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>We sent a 6-digit code to</div>
          <div style={{ fontSize: 13, color: C.gold, fontWeight: "bold", marginBottom: 24 }}>{email}</div>

          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>🔑</span>
            <input
              style={{ ...styles.input, letterSpacing: 6, fontSize: 20, fontWeight: "bold" }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={e => e.key === "Enter" && handleVerify()}
              autoFocus
              autoComplete="one-time-code"
            />
          </div>

          {error && <div style={{ color: "#F87171", fontSize: 13, marginTop: 8 }}>{error}</div>}

          <button style={{ ...styles.primaryBtn, width: "100%", justifyContent: "center", marginTop: 16 }}
            onClick={handleVerify} disabled={loading}>
            {loading ? "Verifying…" : "Verify Code"}
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <button style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer" }}
              onClick={onBack}>← Change email</button>
            <button
              style={{ background: "none", border: "none", fontSize: 13, cursor: resendCooldown > 0 ? "default" : "pointer", color: resendCooldown > 0 ? C.muted : C.gold }}
              onClick={handleResend} disabled={resendCooldown > 0}>
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SPLASH SCREEN ────────────────────────────────────────────────
function SplashScreen({ t, lang, setLang, returningUser, user, hasSavedPlan, onStart, onNewPairing, onOpenHistory, onOpenSavedMeals, onOpenProfile, onOpenRoster, onOpenReferral, onOpenFAQ, isPremium }) {
  return (
    <div style={styles.splash}>
      {user && (
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
            <img src="/nutricrew-logo.jpg" alt="NutriCrew" style={styles.logoImg}/>
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
              <button style={styles.secondaryBtn} onClick={onOpenHistory}>
                📋 {t.history_btn}
              </button>
            )}
            <button style={styles.secondaryBtn} onClick={onOpenSavedMeals}>
              {t.saved_meals_title}
            </button>
            <button style={styles.secondaryBtn} onClick={onOpenRoster}>
              📅 {t.roster_btn} {!isPremium && <span style={{...styles.premiumLockBadge, fontSize: 14}}>👑</span>}
            </button>
            <button style={{ ...styles.secondaryBtn, border: `1px solid ${C.gold}`, color: C.gold }} onClick={onOpenReferral}>
              ✈️ {t.referral_title}
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

        <div style={styles.footerLinksRow}>
          <button style={styles.contactLink} onClick={onOpenFAQ}>
            {t.faq_title}
          </button>
          <span style={styles.contactLink}>·</span>
          <a href="mailto:crewmealplans@nutricrew.ca" style={styles.contactLink}>
            {t.contact_us}
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── CHECK-IN SCREEN ──────────────────────────────────────────────
function CheckInScreen({ t, lang, step, totalSteps, currentStep, pairing, user, upd, onContinue, onBack, setUser }) {
  // key={currentStep} on this component (set in parent) guarantees a fresh mount
  // on every step — no stale localVal between steps.
  const [localVal, setLocalVal] = useState(() => pairing[currentStep] ?? user?.[currentStep] ?? "");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [docNumber] = useState(() => Date.now().toString());
  // Local state for destination inputs — prevents parent re-render on every keystroke.
  const [localDests, setLocalDests] = useState(() => pairing.destinations || []);
  const depTimerRef = useRef(null);
  const tzTimerRef = useRef(null);
  const textSaveTimerRef = useRef(null);
  useEffect(() => { return () => { clearTimeout(depTimerRef.current); clearTimeout(tzTimerRef.current); clearTimeout(textSaveTimerRef.current); }; }, []);

  // Auto-initialize defaults so pre-filled/default values work immediately with Continue
  useEffect(() => {
    if (currentStep === "weight" && !pairing.weight && !user?.weight) {
      upd("weight", "70kg");
      setLocalVal("70");
    }
    if (currentStep === "budget") {
      if (!pairing.budget_type) upd("budget_type", user?.budget_type || "day");
      if (!pairing.budget_amount && !user?.budget_amount) upd("budget_amount", "50");
    }
    if (currentStep === "departure" && !pairing.departure && user?.departure) {
      upd("departure", user.departure);
      setLocalVal(user.departure);
    }
    if (currentStep === "destination") {
      const numDays = pairing.pairing_days || 1;
      const current = pairing.destinations || [];
      if (current.length < numDays) {
        const lastDests = getSavedPlans()[0]?.data?.destinations || [];
        const lastKnown = [...lastDests].reverse().find(d => d && d.trim()) || "";
        if (lastKnown) {
          const filled = Array.from({ length: numDays }, (_, i) => current[i] || lastDests[i] || lastKnown);
          upd("destinations", filled);
          setLocalDests(filled);
        }
      }
    }
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = (v) => {
    upd(currentStep, v);
    if (["name","email","gender","weight","position","dob"].includes(currentStep)) {
      const updated = { ...(user || {}), [currentStep]: v, lang };
      storage.set(USER_KEY, updated);
      setUser(updated);
    }
  };

  const canContinue = () => {
    // Text fields debounce their parent writes — check localVal directly so the
    // Continue button responds instantly as the user types, not 250ms later.
    if (currentStep === "name" || currentStep === "email") return !!localVal.trim();
    if (currentStep === "budget") return !!((pairing.budget_type || user?.budget_type) && (pairing.budget_amount || user?.budget_amount));
    if (currentStep === "duty_schedule") return true;
    // departure is optional — placeholder looks identical to a real value and crews
    // can proceed without it (AI gets "unknown departure" context). They can fill it
    // freely; it's saved to profile on type so it auto-fills on every future pairing.
    if (currentStep === "departure") return true;
    if (currentStep === "destination") {
      const numDays = pairing.pairing_days || 1;
      return localDests.length >= numDays && localDests.slice(0, numDays).every(d => d && d.trim());
    }
    if (currentStep?.startsWith("kitchen_day_")) {
      return (pairing[currentStep] || []).length > 0;
    }
    if (currentStep === "diet") {
      if (!pairing.diets || pairing.diets.length === 0) return false;
      if (pairing.diets.includes("other") && !pairing.diet_other?.trim()) return false;
      return true;
    }
    const v = pairing[currentStep] ?? user?.[currentStep];
    if (!v) return false;
    if (currentStep === "goals" && (!pairing.goals || pairing.goals.length === 0)) return false;
    if (currentStep === "dob") {
      const dob = pairing.dob ?? user?.dob;
      if (!dob) return false;
      const age = Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
      return age >= 16 && age <= 80;
    }
    return true;
  };

  const progress = ((step + 1) / totalSteps) * 100;

  const validationHint = () => {
    if (canContinue()) return null;
    if (currentStep?.startsWith("kitchen_day_")) return t.val_select_kitchen;
    switch (currentStep) {
      case "name":         return t.val_enter_name;
      case "email":        return t.val_enter_email;
      case "gender":       return t.val_select_one;
      case "weight":       return t.val_enter_weight;
      case "dob": {
        const dob = pairing.dob ?? user?.dob;
        if (!dob) return t.val_select_dob;
        const age = Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
        if (age < 16) return t.val_dob_young;
        if (age > 80) return t.val_dob_old;
        return t.val_select_dob;
      }
      case "position":     return t.val_select_one;
      case "kitchen":      return t.val_select_kitchen;
      case "lunch_bag":    return t.val_select_one;
      case "cooking_pref": return t.val_select_one;
      case "diet":
        if (!pairing.diets || pairing.diets.length === 0) return t.val_select_diet;
        if (pairing.diets.includes("other") && !pairing.diet_other?.trim()) return t.val_diet_describe;
        return null;
      case "goals":        return t.val_select_goal;
      case "budget":       return t.val_enter_budget;
      case "pairing_days": return t.val_select_days;
      case "destination":  return t.val_fill_dest;
      case "going_usa":    return t.val_select_usa;
      default:             return null;
    }
  };

  const kitchenOptions = [
    {v:"full_kitchen", l:t.full_kitchen,       icon:"🏠"},
    {v:"hotel",        l:t.hotel_no_kitchen,   icon:"🏨"},
    {v:"fridge",       l:t.fridge,             icon:"🧊"},
    {v:"microwave",    l:t.microwave,          icon:"📦"},
    {v:"airplane_food",l:t.airplane_food,      icon:"✈️"},
  ];

  const stepContent = () => {
    if (currentStep?.startsWith("kitchen_day_")) {
      const dayNum = parseInt(currentStep.replace("kitchen_day_", ""), 10);
      const dest = (pairing.destinations || [])[dayNum - 1];
      const destLabel = dest ? ` — ${dest.replace(/\s*\([A-Z]{2,4}\)/, "").trim()}` : "";
      return <CheckGroup
        label={`${t.day} ${dayNum}${destLabel}: ${t.step_kitchen}`}
        options={kitchenOptions}
        values={pairing[currentStep] || []}
        onChange={v => upd(currentStep, v)}/>;
    }

    switch (currentStep) {
      case "name":
        return <TextInput label={t.step_name} value={localVal}
          onChange={v => { setLocalVal(v); clearTimeout(textSaveTimerRef.current); textSaveTimerRef.current = setTimeout(() => save(v), 250); }}
          placeholder="John Smith" icon="✈️"/>;

      case "email":
        return <TextInput label={t.step_email} value={localVal} type="email"
          onChange={v => { setLocalVal(v); clearTimeout(textSaveTimerRef.current); textSaveTimerRef.current = setTimeout(() => save(v), 250); }}
          placeholder="john@airline.com" icon="📧"/>;

      case "gender":
        return <RadioGroup label={t.step_gender}
          options={[{v:"male",l:t.male},{v:"female",l:t.female},{v:"other",l:t.other}]}
          value={pairing.gender || user?.gender}
          onChange={v => { upd("gender",v); save(v); }}/>;

      case "dob":
        return (
          <div>
            <div style={styles.inputLabel}>{t.step_age}</div>
            <input
              type="date"
              value={pairing.dob || user?.dob || ""}
              max={new Date(Date.now() - 16 * 365.25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}
              min={new Date(Date.now() - 80 * 365.25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}
              onChange={e => { upd("dob", e.target.value); save(e.target.value); }}
              style={{ width: "100%", padding: "14px 16px", fontSize: 16, borderRadius: 12, border: "1.5px solid rgba(201,168,76,0.4)", background: "rgba(255,255,255,0.06)", color: "#fff", outline: "none", boxSizing: "border-box", colorScheme: "dark" }}
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
              onChange={v => { setLocalVal(v); clearTimeout(textSaveTimerRef.current); textSaveTimerRef.current = setTimeout(() => save(v + weightUnit), 250); }}
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
            clearTimeout(depTimerRef.current);
            depTimerRef.current = setTimeout(() => {
              save(v);
              upd("timezone", computeTimezoneDiff(v, pairing.destinations) ?? 0);
            }, 250);
          }}
          placeholder="Montreal (YUL)" icon="🛫"/>;

      case "destination": {
        const numDays = pairing.pairing_days || 1;
        const updDest = (i, v) => {
          const next = [...localDests];
          next[i] = v;
          setLocalDests(next);
          clearTimeout(tzTimerRef.current);
          tzTimerRef.current = setTimeout(() => {
            upd("destinations", next);
            upd("timezone", computeTimezoneDiff(pairing.departure, next) ?? 0);
          }, 250);
        };
        const tzDiff = computeTimezoneDiff(pairing.departure, localDests);
        return (
          <div>
            <div style={styles.inputLabel}>{t.step_route} — {t.destination_label}</div>
            {Array.from({ length: numDays }).map((_, i) => (
              <div key={i} style={{marginBottom: 12}}>
                <div style={styles.hint}>{t.day} {i+1}</div>
                <TextInput value={localDests[i] || ""}
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

      case "duty_schedule":
        return <DutyScheduleStep t={t} pairing={pairing} upd={upd} />;

      case "lunch_bag":
        return <RadioGroup label={t.step_lunch_bag}
          options={[
            {v:"small",  l:t.bag_small,  icon:"👜"},
            {v:"medium", l:t.bag_medium, icon:"🎒"},
            {v:"large",  l:t.bag_large,  icon:"🧳"},
          ]}
          value={pairing.lunch_bag || user?.lunch_bag}
          onChange={v => { upd("lunch_bag", v); save(v); }}/>;

      case "kitchen":
        return <CheckGroup label={t.step_kitchen}
          options={kitchenOptions}
          values={pairing.kitchen || []}
          onChange={v => upd("kitchen", v)}/>;

      case "cooking_pref":
        return <RadioGroup label={t.step_cooking_pref}
          options={[
            {v:"enjoys_cooking",l:t.cooking_enjoy,icon:"👨‍🍳"},
            {v:"simple_recipes",l:t.cooking_simple,icon:"⏱️"},
          ]}
          value={pairing.cooking_pref || user?.cooking_pref}
          onChange={v => upd("cooking_pref", v)}/>;

      case "airplane_meal_plan":
        return (
          <div>
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 15, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>✈️ {t.step_airplane_meal}</div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>{t.airplane_meal_plan_hint}</div>
            <textarea
              value={pairing.airplane_meal_description || ""}
              onChange={e => upd("airplane_meal_description", e.target.value)}
              placeholder={t.airplane_meal_plan_placeholder}
              rows={5}
              style={{
                width: "100%", boxSizing: "border-box",
                background: C.navyMid, border: `1px solid ${C.navyBorder}`,
                borderRadius: 10, color: C.white, padding: "12px 14px",
                fontSize: 14, resize: "vertical", outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => { upd("airplane_meal_description", ""); onContinue(); }}
              style={{
                marginTop: 12, width: "100%", padding: "11px 0",
                background: "transparent", border: `1px solid ${C.navyBorder}`,
                borderRadius: 10, color: C.muted, fontSize: 13, cursor: "pointer",
              }}
            >{t.airplane_meal_plan_skip}</button>
          </div>
        );

      case "diet":
        return (
          <div>
            <CheckGroup label={t.step_diet}
              options={[
                {v:"none",l:t.no_restrictions,icon:"🍽️"},
                {v:"vegetarian",l:t.vegetarian,icon:"🥗"},
                {v:"vegan",l:t.vegan,icon:"🌱"},
                {v:"halal",l:t.halal,icon:"☪️"},
                {v:"kosher",l:t.kosher,icon:"✡️"},
                {v:"low_carb",l:t.low_carb,icon:"🥑"},
                {v:"mediterranean",l:t.mediterranean,icon:"🫒"},
                {v:"carnivore",l:t.carnivore,icon:"🥩"},
                {v:"paleo",l:t.paleo,icon:"🦴"},
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
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginTop: 18, marginBottom: 8 }}>
              🚨 {t.allergies_section}
            </div>
            <CheckGroup label=""
              options={[
                {v:"gluten_free",l:t.gluten_free,icon:"🌾"},
                {v:"dairy_free",l:t.dairy_free,icon:"🧀"},
                {v:"lactose_free",l:t.lactose_free,icon:"🥛"},
                {v:"nut_free",l:t.nut_free,icon:"🥜"},
                {v:"egg_free",l:t.egg_free,icon:"🥚"},
                {v:"shellfish_free",l:t.shellfish_free,icon:"🦐"},
                {v:"soy_free",l:t.soy_free,icon:"🫘"},
                {v:"fodmap",l:t.fodmap,icon:"🌿"},
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
            {v:"gain_weight",l:t.gain_weight,icon:"📈"},
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
                  style={{...styles.unitBtn, ...((pairing.budget_type || user?.budget_type || "day")===u?styles.unitBtnActive:{})}}
                  onClick={() => upd("budget_type", u)}>
                  {u === "day" ? t.budget_day : t.budget_total}
                </button>
              ))}
            </div>
            <TextInput value={pairing.budget_amount || user?.budget_amount || ""} type="number"
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
        <div style={styles.stepCounter}>Step {step+1} of {totalSteps}</div>
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

      {/* Validation hint */}
      {validationHint() && (
        <div style={{ color: "#b0a080", fontSize: 12, textAlign: "center", marginTop: 10, marginBottom: -2, padding: "0 16px" }}>
          {validationHint()}
        </div>
      )}

      {/* Nav */}
      <div style={styles.navRow}>
        <button style={styles.backBtn} onClick={handleBack}>{t.back}</button>
        <button
          style={{...styles.continueBtn, ...(canContinue()?{}:styles.continueBtnDisabled)}}
          disabled={!canContinue()}
          onClick={() => {
            if (currentStep === "name" || currentStep === "email") {
              clearTimeout(textSaveTimerRef.current);
              save(localVal);
            }
            if (currentStep === "weight") {
              clearTimeout(textSaveTimerRef.current);
              save(localVal + weightUnit);
            }
            if (currentStep === "departure") {
              clearTimeout(depTimerRef.current);
              save(localVal);
              upd("timezone", computeTimezoneDiff(localVal, pairing.destinations) ?? 0);
            }
            if (currentStep === "destination") {
              clearTimeout(tzTimerRef.current);
              upd("destinations", localDests);
              upd("timezone", computeTimezoneDiff(pairing.departure, localDests) ?? 0);
            }
            onContinue();
          }}>
          {t.continue}
        </button>
      </div>
    </div>
  );

  function handleBack() { onBack(); }
}

// ─── BOARDING PASS ────────────────────────────────────────────────
function BoardingPassScreen({ t, user, pairing, onGenerate, onBack, isPremiumNeeded, isOnline }) {
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
          <BPField label="GOALS" value={(mergedUser.goals||[]).slice(0,2).join(", ").replace(/_/g," ").toUpperCase() || "—"}/>
          <BPField label="BUDGET" value={mergedUser.budget_amount ? `$${mergedUser.budget_amount}/${mergedUser.budget_type==="day"?"DAY":"TRIP"}` : "—"}/>
          {Math.abs(parseInt(pairing.timezone||0)) >= 4 && (
            <BPField label="JET LAG" value={`${pairing.timezone}H DIFF ⚠️`} highlight/>
          )}
          {pairing.report_time && (
            <div style={{ gridColumn: "1 / -1", background: C.navyMid, padding: "12px 16px" }}>
              <div style={{ fontSize: 9, color: C.muted, letterSpacing: "2px", marginBottom: 4 }}>DUTY MODE</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>🧠 COGNITIVE MODE | DUTY OPTIMIZED</div>
            </div>
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

      {!isOnline && (
        <div style={{ background: "#3A2A00", border: `1px solid ${C.gold}`, borderRadius: 10, padding: "8px 14px", margin: "12px 0 0", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>📵</span>
          <span style={{ color: C.gold, fontSize: 13 }}>{t.offline_generate}</span>
        </div>
      )}

      <div style={styles.navRow}>
        <button style={styles.backBtn} onClick={onBack}>{t.back}</button>
        <button style={{ ...styles.primaryBtn, ...(isOnline === false ? { opacity: 0.5, cursor: "not-allowed" } : {}) }} onClick={onGenerate}>
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
const PLAN_LOAD_STEPS = [
  "Checking your preferences...",
  "Sourcing local ingredients...",
  "Planning your meals...",
  "Calculating nutrition...",
  "Finalizing your plan...",
];

function PlanScreen({ t, plan, loading, pairing, user, activeTab, setActiveTab, activeDay, setActiveDay, onNewPairing, onRetry, favorites, onToggleFavorite, onOpenAirplaneMeal, isPremium, isOnline, planKey, onShare, shareCopied, onOpenReferral }) {
  const days = pairing.pairing_days || 1;
  const hasJetlag = Math.abs(parseInt(pairing.timezone||0)) >= 4;
  const [loadStep, setLoadStep] = useState(0);

  useEffect(() => {
    if (!loading) { setLoadStep(0); return; }
    const id = setInterval(() => setLoadStep(s => (s + 1) % PLAN_LOAD_STEPS.length), 2500);
    return () => clearInterval(id);
  }, [loading]);

  if (loading) return (
    <div style={styles.loadingScreen}>
      <div style={styles.loadingPlane}>
        <PlaneIcon size={48} color={C.gold}/>
      </div>
      <div style={styles.loadingText}>{PLAN_LOAD_STEPS[loadStep]}</div>
      <div style={{ width: 220, height: 4, background: C.navyCard, borderRadius: 2, margin: "16px auto 0", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${((loadStep + 1) / PLAN_LOAD_STEPS.length) * 100}%`,
          background: C.gold,
          borderRadius: 2,
          transition: "width 0.5s ease",
        }}/>
      </div>
    </div>
  );

  if (!plan || plan.error) return (
    <div style={styles.loadingScreen}>
      <div style={{fontSize:40}}>⚠️</div>
      <div style={styles.loadingText}>{t.plan_error}</div>
      <div style={{ color: C.muted, fontSize: 13, marginBottom: 20, textAlign: "center", maxWidth: 280 }}>
        Your pairing data is saved. Tap Retry and we'll try again.
      </div>
      <button style={styles.primaryBtn} onClick={onRetry}>{t.try_again}</button>
      <button style={{ ...styles.primaryBtn, background: "transparent", color: C.muted, border: `1px solid ${C.navyBorder}`, marginTop: 10 }} onClick={onNewPairing}>{t.new_pairing}</button>
    </div>
  );

  return (
    <div style={styles.planScreen}>
      {/* Offline banner */}
      {!isOnline && (
        <div style={{ background: "#3A2A00", border: `1px solid ${C.gold}`, borderRadius: 10, padding: "8px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>📵</span>
          <span style={{ color: C.gold, fontSize: 13 }}>{t.offline_banner}</span>
        </div>
      )}
      {/* Header */}
      <div style={styles.planHeader}>
        <div>
          <div style={styles.planTitle}>NutriCrew</div>
          <div style={styles.planSub}>{user?.name?.split(" ")[0]} · {days} {t.days}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            style={{ background: "transparent", border: `1px solid ${C.gold}`, color: C.gold, borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
            onClick={onShare}
            title={t.share_btn}
          >
            📤 {shareCopied ? t.share_copied : t.share_btn}
          </button>
          <button style={styles.newPairingBtn} onClick={onNewPairing}>
            + {t.new_pairing}
          </button>
        </div>
      </div>
      {shareCopied && (
        <div style={{ background: "#0F2A10", border: `1px solid ${C.green}`, borderRadius: 8, padding: "7px 14px", marginBottom: 10, color: C.green, fontSize: 13, textAlign: "center" }}>
          {t.share_copied}
        </div>
      )}

      {/* Your selections — confirms what this plan was generated for */}
      {(() => {
        const mergedUser = { ...(user || {}), ...pairing };
        const allDiets = mergedUser.diets || (mergedUser.diet ? [mergedUser.diet] : []);
        const filteredDiets = allDiets.filter(d => d !== "none");
        const dietDisplay = filteredDiets.length === 0
          ? t.no_restrictions
          : filteredDiets.map(d => d === "other" ? (mergedUser.diet_other || "OTHER").toUpperCase() : d.replace(/_/g, " ").toUpperCase()).join(" + ");
        const goalsDisplay = (mergedUser.goals || []).slice(0, 2).join(", ").replace(/_/g, " ").toUpperCase();
        return (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            <span style={styles.selectionChip}>🍽️ {dietDisplay}</span>
            {goalsDisplay && <span style={styles.selectionChip}>🎯 {goalsDisplay}</span>}
            {mergedUser.budget_amount && (
              <span style={styles.selectionChip}>💰 ${mergedUser.budget_amount}/{mergedUser.budget_type === "day" ? "DAY" : "TRIP"}</span>
            )}
          </div>
        );
      })()}

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

      {/* Partial plan warning */}
      {plan.failedDays?.length > 0 && (
        <div style={{ background: "#3A1500", border: "1px solid #CC5500", borderRadius: 10, padding: "8px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚠️</span>
          <span style={{ color: "#FF8040", fontSize: 13 }}>
            {plan.failedDays.length === 1
              ? `Day ${plan.failedDays[0]} couldn't be generated. Select it and tap Retry.`
              : `Days ${plan.failedDays.join(", ")} couldn't be generated. Select one and tap Retry.`}
          </span>
        </div>
      )}

      {/* Cognitive performance badge */}
      {plan.performanceAdvisory && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#0F2040", border: `1px solid ${C.sky}`, borderRadius: 10, padding: "8px 14px", marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>🧠</span>
          <span style={{ color: C.sky, fontWeight: 700, fontSize: 13 }}>{t.perf_badge}</span>
          <span style={{ color: C.muted, fontSize: 11 }}>Meals timed to your duty schedule</span>
        </div>
      )}

      {/* Hydration target banner */}
      {plan.hydration && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#081A2E", border: `1px solid #2A6090`, borderRadius: 10, padding: "8px 14px", marginBottom: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>💧</span>
          <div>
            <div style={{ color: C.skyLight, fontWeight: 700, fontSize: 13 }}>
              {t.hydration_target}: <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 15 }}>{plan.hydration.dailyTargetLiters}L</span>
            </div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>
              {(plan.hydration.category === "ultra-long-haul" || plan.hydration.category === "long-haul")
                ? t.hydration_longhauul
                : plan.hydration.category === "medium-haul"
                  ? t.hydration_medium
                  : t.hydration_domestic}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabBar}>
        {["plan","grocery","restrictions","nearby",...(plan.performanceAdvisory ? ["performance"] : [])].map(tab => (
          <button key={tab}
            style={{...styles.tab, ...(activeTab===tab?styles.tabActive:{})}}
            onClick={() => setActiveTab(tab)}>
            {tab === "plan" ? "🍽️" : tab === "grocery" ? "🛒" : tab === "restrictions" ? "🚫" : tab === "performance" ? "⚡" : "📍"}
            <span style={styles.tabLabel}>
              {tab === "plan" ? t.tab_plan : tab === "grocery" ? t.tab_grocery : tab === "restrictions" ? t.tab_restrictions : tab === "performance" ? t.tab_performance : t.tab_nearby}
            </span>
            {tab === "nearby" && !isPremium && <span style={styles.premiumLockBadge}>👑</span>}
          </button>
        ))}
      </div>

      {/* Day selector */}
      {activeTab === "plan" && (
        <div style={styles.daySelector}>
          {[...Array(days)].map((_,i) => {
            const isFailed = plan.days?.[i]?.failed;
            return (
              <button key={i}
                style={{
                  ...styles.dayChip,
                  ...(activeDay===i ? styles.dayChipActive : {}),
                  ...(isFailed ? { borderColor: "#CC5500", color: "#FF8040" } : {}),
                }}
                onClick={() => setActiveDay(i)}>
                {isFailed ? "⚠ " : ""}{t.day} {i+1}
              </button>
            );
          })}
        </div>
      )}

      <div style={styles.planContent}>
        {activeTab === "plan" && plan.days?.[activeDay] && (
          plan.days[activeDay].failed
            ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
                <div style={{ color: C.white, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
                  Day {plan.days[activeDay].day} couldn't be generated
                </div>
                <div style={{ color: C.muted, fontSize: 13, marginBottom: 20, maxWidth: 260, margin: "0 auto 20px" }}>
                  Your pairing data is saved. Tap Retry and we'll pick up where we left off.
                </div>
                <button style={styles.primaryBtn} onClick={onRetry}>{t.try_again}</button>
              </div>
            )
            : <DayPlan day={plan.days[activeDay]} t={t} favorites={favorites} onToggleFavorite={onToggleFavorite} onOpenAirplaneMeal={onOpenAirplaneMeal}/>
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
        {activeTab === "performance" && plan.performanceAdvisory && (
          <div style={{ padding: "4px 0" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.sky, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span>⚡</span>{t.perf_advisory_title}
            </div>
            {plan.performanceAdvisory.replace(/^COGNITIVE PERFORMANCE PROTOCOL[^\n]*\n/, "").split("\n\n").map((block, i) => (
              <div key={i} style={{ background: C.navyCard, borderRadius: 12, padding: "14px 16px", marginBottom: 12, border: `1px solid ${C.navyBorder}` }}>
                <div style={{ color: C.white, fontSize: 13, lineHeight: 1.6 }}>
                  {block.split("\n").map((line, j) => (
                    <div key={j} style={{ marginBottom: line.startsWith("-") ? 4 : 0, color: j === 0 ? C.gold : C.muted }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback section — only shown when a real plan is loaded */}
      {planKey && <PlanFeedback t={t} planKey={planKey} />}
    </div>
  );
}

function PlanFeedback({ t, planKey }) {
  const existing = getPlanFeedback(planKey);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(!!existing);
  const [ratings, setRatings] = useState(existing ? { energy: existing.energy, satiety: existing.satiety, jetlag: existing.jetlag } : { energy: 0, satiety: 0, jetlag: 0 });
  const [comment, setComment] = useState(existing?.comment || "");

  const handleSubmit = () => {
    savePlanFeedback(planKey, { energy: ratings.energy, satiety: ratings.satiety, jetlag: ratings.jetlag, comment: comment.trim() });
    setSubmitted(true);
    setOpen(false);
  };

  const StarRow = ({ label, key: rkey, value, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ color: C.muted, fontSize: 13, minWidth: 80 }}>{label}</span>
      <div style={{ display: "flex", gap: 6 }}>
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, padding: 0, lineHeight: 1, opacity: n <= value ? 1 : 0.25 }}>
            ⭐
          </button>
        ))}
      </div>
    </div>
  );

  if (submitted && !open) return (
    <div style={{ margin: "20px 0 8px", textAlign: "center", color: C.muted, fontSize: 13 }}>
      ✓ {t.feedback_thanks}
    </div>
  );

  if (!open) return (
    <div style={{ margin: "20px 0 8px", textAlign: "center" }}>
      <button onClick={() => setOpen(true)}
        style={{ background: "none", border: `1px solid ${C.navyBorder}`, borderRadius: 20, padding: "8px 20px", color: C.muted, fontSize: 13, cursor: "pointer" }}>
        ⭐ {t.feedback_prompt}
      </button>
    </div>
  );

  return (
    <div style={{ background: C.navyCard, borderRadius: 14, padding: "16px 18px", margin: "16px 0 8px", border: `1px solid ${C.navyBorder}` }}>
      <div style={{ color: C.gold, fontWeight: 700, fontSize: 14, marginBottom: 16 }}>⭐ {t.feedback_prompt}</div>
      <StarRow label={t.feedback_energy} rkey="energy" value={ratings.energy} onChange={v => setRatings(r => ({...r, energy: v}))}/>
      <StarRow label={t.feedback_satiety} rkey="satiety" value={ratings.satiety} onChange={v => setRatings(r => ({...r, satiety: v}))}/>
      <StarRow label={t.feedback_jetlag} rkey="jetlag" value={ratings.jetlag} onChange={v => setRatings(r => ({...r, jetlag: v}))}/>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder={t.feedback_comment_placeholder}
        rows={3}
        style={{ width: "100%", boxSizing: "border-box", background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 10, color: C.white, padding: "10px 12px", fontSize: 13, resize: "none", outline: "none", fontFamily: "inherit", marginBottom: 12 }}
      />
      <button
        onClick={handleSubmit}
        disabled={!ratings.energy && !ratings.satiety && !ratings.jetlag}
        style={{ ...{ width: "100%", padding: "11px 0", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer", border: "none", background: C.gold, color: C.navy }, ...(!ratings.energy && !ratings.satiety && !ratings.jetlag ? { opacity: 0.4, cursor: "not-allowed" } : {}) }}>
        {t.feedback_submit}
      </button>
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
      {day.hydrationNote && (
        <div style={{ background: "#081A2E", border: "1px solid #2A6090", borderRadius: 8, padding: "6px 12px", marginBottom: 10, fontSize: 12, color: "#7BBFE0", display: "flex", alignItems: "center", gap: 7 }}>
          <span>💧</span><span>{day.hydrationNote}</span>
        </div>
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
                {meal.container && (
                  <div style={{fontSize:13, color:"#C9A84C", background:"rgba(201,168,76,0.1)", borderRadius:8, padding:"6px 10px", marginTop:6, display:"flex", alignItems:"center", gap:6}}>
                    <span>📦</span><span>{meal.container}</span>
                  </div>
                )}
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
  const storageKey = "grocery_checked_" + btoa(JSON.stringify(list)).slice(0, 32);
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { return {}; }
  });
  const toggle = (key) => setChecked(prev => {
    const next = { ...prev, [key]: !prev[key] };
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
    return next;
  });
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
          {list[s.key].map((item, i) => {
            const id = `${s.key}-${i}`;
            const done = !!checked[id];
            return (
              <div key={i} style={styles.grocItem} onClick={() => toggle(id)}>
                <div style={{
                  ...styles.checkbox,
                  background: done ? C.gold : "transparent",
                  borderColor: done ? C.gold : C.navyBorder,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                }}>
                  {done && <span style={{ color: C.navy, fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{ ...styles.grocText, textDecoration: done ? "line-through" : "none", opacity: done ? 0.45 : 1 }}>{item}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function FoodRestrictions({ data, pairing }) {
  return (
    <div>
      {data.carried && (
        <div style={{...styles.restrictCard, borderLeft: "3px solid #e8a020"}}>
          <div style={styles.restrictTitle}>⚠️ Packed & Carried Food Rules</div>
          <div style={styles.restrictText}>{data.carried}</div>
        </div>
      )}
      {pairing.going_usa === "yes" && (
        <div style={styles.restrictCard}>
          <div style={styles.restrictTitle}>🇺🇸 USA Customs Rules</div>
          <div style={styles.restrictText}>{data.usa}</div>
        </div>
      )}
      {data.destination && (
        <div style={styles.restrictCard}>
          <div style={styles.restrictTitle}>🌍 {[...new Set(pairing.destinations || [])].join(", ")} Rules</div>
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

  const PlaceCard = ({ place, typeIcon }) => (
    <div style={styles.placeCard}>
      <div style={styles.placeName}>{typeIcon} {place.name}</div>
      {place.rating != null && (
        <div style={styles.placeRating}>⭐ {"★".repeat(Math.round(place.rating))}{"☆".repeat(5 - Math.round(place.rating))} {place.rating.toFixed(1)}</div>
      )}
      <div style={styles.placeAddress}>📍 {place.address}</div>
      {place.open_now != null && (
        <div style={{...styles.placeStatus, color: place.open_now ? C.green : C.red}}>
          {place.open_now ? `🟢 ${t.nearby_open}` : `🔴 ${t.nearby_closed}`}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={styles.nearbySection}>
        <div style={styles.nearbySectionTitle}>🛒 {t.nearby_groceries}</div>
        {data.groceries?.length ? data.groceries.map((p, i) => <PlaceCard key={i} place={p} typeIcon="🏪"/>) : <div style={styles.placeAddress}>No results found.</div>}
      </div>
      <div style={styles.nearbySection}>
        <div style={styles.nearbySectionTitle}>🍽️ {t.nearby_restaurants}</div>
        {data.restaurants?.length ? data.restaurants.map((p, i) => <PlaceCard key={i} place={p} typeIcon="🍴"/>) : <div style={styles.placeAddress}>No results found.</div>}
      </div>
    </div>
  );
}

// ─── PREMIUM SCREEN ───────────────────────────────────────────────
function PremiumScreen({ t, onBack, onUpgrade, premiumSuccess, onGenerate, returnScreen }) {
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [billing, setBilling] = useState("monthly"); // monthly | annual

  const handleClick = async () => {
    setLoading(true);
    setCheckoutError(null);
    try {
      await onUpgrade(billing);
    } catch (err) {
      setCheckoutError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (premiumSuccess) {
    const ctaBack = returnScreen === "splash" || returnScreen === "plan";
    return (
      <div style={styles.premiumScreen}>
        <div style={styles.premiumIcon}>🎉</div>
        <div style={styles.premiumTitle}>Welcome to Premium!</div>
        <div style={styles.premiumMsg}>
          {ctaBack
            ? "Your account is now active. Gym Plans, Roster Automation, Calorie Deficit plans, Jetlag Meal Plans, Cognitive Performance meal timing, and Nearby Places are all unlocked."
            : "Your account is now active. Tap below to generate your plan."}
        </div>
        <button style={styles.primaryBtn} onClick={ctaBack ? onBack : onGenerate}>
          {ctaBack ? "Continue" : "Generate My Plan"}
        </button>
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
          "💪 Personalized monthly gym plans",
          "📅 Roster upload & auto plan delivery",
          "🔥 Calorie deficit plans",
          "🌍 Jetlag meal-timing plan",
        ].map(f => (
          <div key={f} style={styles.premiumFeature}>✓ {f}</div>
        ))}
        <div style={{ ...styles.premiumFeature, color: C.gold, fontWeight: 700, borderLeft: `3px solid ${C.gold}`, paddingLeft: 13 }}>
          ✓ 🧠 Cognitive Performance meal timing
        </div>
        {[
          "📍 Nearby stores & restaurants",
        ].map(f => (
          <div key={f} style={styles.premiumFeature}>✓ {f}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 320, margin: "8px 0 16px" }}>
        <button
          onClick={() => setBilling("monthly")}
          style={{
            flex: 1, padding: "10px 12px", borderRadius: 12, cursor: "pointer", textAlign: "center",
            background: billing === "monthly" ? C.gold : "transparent",
            color: billing === "monthly" ? C.navy : C.muted,
            border: `1.5px solid ${billing === "monthly" ? C.gold : C.navyBorder}`,
            fontWeight: 700, fontSize: 14,
          }}
        >
          Monthly<br/><span style={{fontWeight: 400, fontSize: 12}}>$7.99/mo</span>
        </button>
        <button
          onClick={() => setBilling("annual")}
          style={{
            flex: 1, padding: "10px 12px", borderRadius: 12, cursor: "pointer", textAlign: "center", position: "relative",
            background: billing === "annual" ? C.gold : "transparent",
            color: billing === "annual" ? C.navy : C.muted,
            border: `1.5px solid ${billing === "annual" ? C.gold : C.navyBorder}`,
            fontWeight: 700, fontSize: 14,
          }}
        >
          <span style={{ position: "absolute", top: -10, right: -6, background: C.green, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 8 }}>SAVE 35%</span>
          Annual<br/><span style={{fontWeight: 400, fontSize: 12}}>$62.32/yr</span>
        </button>
      </div>

      {checkoutError && (
        <div style={{ color: "#e55", fontSize: 13, textAlign: "center", marginBottom: 8, maxWidth: 280 }}>
          {checkoutError}
        </div>
      )}
      <button style={styles.primaryBtn} onClick={handleClick} disabled={loading}>
        {loading ? "Taking you to secure checkout…" : billing === "annual" ? `${t.upgrade} — $62.32/year` : `${t.upgrade} — $7.99/month`}
      </button>
      <button style={{...styles.backBtn, flex: "none"}} onClick={onBack}>{t.back}</button>
    </div>
  );
}

// ─── ROSTER TEXT PARSER ───────────────────────────────────────────
const MONTH_IDX = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
const USA_IATA = new Set(["JFK","EWR","LGA","LAX","ORD","ATL","DFW","DEN","SFO","SEA","BOS","MIA","PHX","LAS","MCO","IAH","MSP","DTW","CLT","PHL","BWI","SAN","TPA","MDW","HNL","SLC","AUS","SNA","OAK","SMF","MSY","STL","RDU","BNA","PIT","CLE","CMH","IND","FLL","SJC","HOU","DAL","PDX","MKE","CVG","RSW","FLL","BUR","ONT"]);

function parseRosterText(text, homeBase) {
  const y = new Date().getFullYear();

  function parseOneDate(s) {
    s = s.replace(/\b(\d+)(st|nd|rd|th)\b/i, "$1").trim();
    let m;
    m = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (m) return new Date(+m[1], +m[2]-1, +m[3]);
    m = s.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
    if (m) return new Date(y, +m[1]-1, +m[2]);
    m = s.match(/^([A-Za-z]{3,9})\s+(\d{1,2})$/);
    if (m) { const mo = MONTH_IDX[m[1].slice(0,3).toLowerCase()]; if (mo !== undefined) return new Date(y, mo, +m[2]); }
    m = s.match(/^(\d{1,2})\s+([A-Za-z]{3,9})$/);
    if (m) { const mo = MONTH_IDX[m[2].slice(0,3).toLowerCase()]; if (mo !== undefined) return new Date(y, mo, +m[1]); }
    return null;
  }

  function toYMD(d) {
    if (!d) return null;
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  }

  // Split by newline; also split by comma when all comma-segments contain a route pattern
  const rawLines = text.split(/\n/).map(s => s.trim()).filter(Boolean);
  const lines = [];
  for (const l of rawLines) {
    const parts = l.split(/,\s*/);
    if (parts.length > 1 && parts.every(p => /[A-Z]{3}\s*[-–]\s*[A-Z]{3}/i.test(p))) {
      lines.push(...parts.map(p => p.trim()));
    } else {
      lines.push(l);
    }
  }

  const pairings = [], errors = [];

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+/g, " ").trim();

    // Extract route: 2+ IATA codes joined by dashes (spaces around dashes OK)
    const routeMatch = line.match(/([A-Z]{3}(?:\s*[-–]\s*[A-Z]{3})+)/i);
    if (!routeMatch) {
      errors.push({ line: rawLine, message: `No airport route found — expected format: YUL-CDG-YUL` });
      continue;
    }
    const routeRaw = routeMatch[1];
    const codes = routeRaw.split(/\s*[-–]\s*/).map(c => c.toUpperCase()).filter(c => /^[A-Z]{3}$/.test(c));
    if (codes.length < 2) {
      errors.push({ line: rawLine, message: `Route needs at least 2 airport codes` });
      continue;
    }

    const departure = homeBase || codes[0];
    // YUL-CDG-YUL: destinations=[CDG]; YUL-CDG-LHR-YUL: destinations=[CDG,LHR]; YUL-CDG: destinations=[CDG]
    const destinations = codes.length === 2 ? [codes[1]] : codes.slice(1, -1);

    // Date part: everything before the route, strip trailing punctuation
    const routeIdx = line.search(/[A-Z]{3}\s*[-–]\s*[A-Z]{3}/i);
    const datePart = line.slice(0, routeIdx).trim().replace(/[,;:\s]+$/, "");

    // Check for a date range "Jun 30-Jul 2" or "Jun 30 - Jul 2"
    // Range: first part ends in a digit, separator is dash, second part starts with letter or digit
    let pairingDate, returnDate;
    const rangeMatch = datePart.match(/^(.+?\d)\s*[-–]\s*([A-Za-z\d].+)$/);
    if (rangeMatch) {
      pairingDate = parseOneDate(rangeMatch[1].trim());
      returnDate = parseOneDate(rangeMatch[2].trim());
    } else {
      pairingDate = parseOneDate(datePart);
    }

    if (!pairingDate) {
      errors.push({ line: rawLine, message: `Can't read date "${datePart || "(empty)"}" — try: "Jul 2", "07/02", or "2026-07-02"` });
      continue;
    }

    const effectiveReturn = returnDate || pairingDate;
    const pairingDays = returnDate && returnDate > pairingDate
      ? Math.round((returnDate - pairingDate) / 864e5) + 1 : 1;

    pairings.push({
      pairingDate: toYMD(pairingDate),
      returnDate: toYMD(effectiveReturn),
      pairingDays,
      departure,
      destinations,
      goingUsa: destinations.some(d => USA_IATA.has(d)) ? "yes" : "no",
      timezone: 0,
    });
  }

  return { pairings, errors };
}

// ─── ROSTER MODAL ─────────────────────────────────────────────────
function RosterModal({ t, user, onClose, onRequirePremium }) {
  const [phase, setPhase] = useState("upload"); // upload | parsing | confirm | saving | done | error
  const [images, setImages] = useState([]);
  const [homeBase, setHomeBase] = useState(user?.departure || "");
  const [pairings, setPairings] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [showGymPlan, setShowGymPlan] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [inputMode, setInputMode] = useState("photo");
  const [rosterText, setRosterText] = useState("");
  const [parseErrors, setParseErrors] = useState([]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
  };

  const handleParse = async () => {
    if (images.length === 0) return;
    setPhase("parsing");
    try {
      const encoded = await Promise.all(images.map(f => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ data: reader.result.split(",")[1], mediaType: f.type || "image/jpeg" });
        reader.onerror = reject;
        reader.readAsDataURL(f);
      })));
      const res = await fetch(`${API_BASE}/api/roster/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: encoded, homeBase, lang: user?.lang || "en", email: user?.email }),
      });
      const data = await res.json();
      if (res.status === 403 && data.error === "premium_required") { onRequirePremium?.(); return; }
      if (!res.ok || !Array.isArray(data.pairings)) throw new Error(data.error || "parse failed");
      if (data.pairings.length === 0) { setErrMsg(t.roster_no_pairings); setPhase("error"); return; }
      setPairings(data.pairings);
      setPhase("confirm");
    } catch (e) {
      setErrMsg(t.roster_error);
      setPhase("error");
    }
  };

  const handleTextParse = () => {
    const { pairings: parsed, errors } = parseRosterText(rosterText, homeBase);
    setParseErrors(errors);
    if (parsed.length === 0) {
      setErrMsg(errors.length > 0
        ? `Could not parse any pairings. See errors below and check your format.`
        : `No pairings found. Each line should look like: "Jul 2 YUL-LHR-YUL"`
      );
      setPhase("error");
      return;
    }
    setPairings(parsed);
    setPhase("confirm");
  };

  const handleConfirm = async () => {
    setPhase("saving");
    try {
      const profile = {
        name: user?.name || "", gender: user?.gender || "", weight: user?.weight || "",
        dob: user?.dob || "", position: user?.position || "cabin",
        diets: user?.diets || ["none"], goals: user?.goals || ["energy"],
        budgetAmount: user?.budget_amount || "30", budgetType: user?.budget_type || "day",
        lang: user?.lang || "en", lunchBag: user?.lunch_bag || null,
        kitchen: user?.kitchen || [],
      };
      const res = await fetch(`${API_BASE}/api/roster/store-pairings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, pairings, profile }),
      });
      const saveData = await res.json().catch(() => ({}));
      if (res.status === 403 && saveData.error === "premium_required") { onRequirePremium?.(); return; }
      if (!res.ok) throw new Error("save failed");
      // Fire gym plan generation in background (don't block the done screen)
      fetch(`${API_BASE}/api/gym-plan/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, pairings, profile }),
      }).catch(() => {});
      setPhase("done");
    } catch {
      setErrMsg(t.roster_error);
      setPhase("error");
    }
  };

  const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 };
  const card = { background: C.navyMid, borderRadius: 20, padding: "28px 24px", width: "100%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto", position: "relative" };
  const inputStyle = { width: "100%", boxSizing: "border-box", background: C.navy, border: `1px solid ${C.navyBorder}`, borderRadius: 8, color: C.white, padding: "9px 12px", fontSize: 13, outline: "none", fontFamily: "inherit" };

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={card}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer" }}>✕</button>

        {phase === "upload" && (
          <div>
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 17, marginBottom: 14 }}>📅 {t.roster_title}</div>

            {/* Input mode tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 18, background: C.navy, borderRadius: 10, padding: 4 }}>
              {[["photo", "📷 Photos"], ["text", "📝 Paste Text"]].map(([mode, label]) => (
                <button key={mode} onClick={() => setInputMode(mode)}
                  style={{ flex: 1, padding: "8px 4px", borderRadius: 7, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer",
                    background: inputMode === mode ? C.gold : "transparent",
                    color: inputMode === mode ? C.navy : C.muted }}
                >{label}</button>
              ))}
            </div>

            <div style={{ color: C.white, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{t.roster_home_base}</div>
            <input
              value={homeBase}
              onChange={e => setHomeBase(e.target.value)}
              placeholder={t.roster_home_base_placeholder}
              style={{ width: "100%", boxSizing: "border-box", background: C.navy, border: `1px solid ${C.navyBorder}`, borderRadius: 10, color: C.white, padding: "11px 14px", fontSize: 14, outline: "none", marginBottom: 16, fontFamily: "inherit" }}
            />

            {inputMode === "photo" && (
              <>
                <div style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>{t.roster_hint}</div>
                <label style={{ display: "block", padding: "16px", background: C.navy, border: `2px dashed ${C.navyBorder}`, borderRadius: 12, textAlign: "center", cursor: "pointer", marginBottom: 16 }}>
                  <input type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: "none" }} />
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                  <div style={{ color: C.gold, fontWeight: 600, marginBottom: 4 }}>{t.roster_upload_btn}</div>
                  <div style={{ color: C.muted, fontSize: 12 }}>Up to 4 photos</div>
                </label>
                {images.length > 0 && (
                  <div style={{ color: C.green, fontSize: 13, marginBottom: 16 }}>✓ {images.length} photo{images.length > 1 ? "s" : ""} selected: {images.map(f => f.name).join(", ")}</div>
                )}
                <button onClick={handleParse} disabled={images.length === 0}
                  style={{ width: "100%", padding: "14px", background: images.length > 0 ? C.gold : C.navyBorder, color: images.length > 0 ? C.navy : C.muted, border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: images.length > 0 ? "pointer" : "default" }}
                >{t.roster_upload_btn} →</button>
              </>
            )}

            {inputMode === "text" && (
              <>
                <div style={{ color: C.muted, fontSize: 12, marginBottom: 10, lineHeight: 1.7 }}>
                  One pairing per line, or comma-separated.<br />
                  Format: <span style={{ color: C.gold, fontFamily: "monospace" }}>Jul 2 YUL-LHR-YUL</span><br />
                  Multi-day: <span style={{ color: C.gold, fontFamily: "monospace" }}>Jul 2-Jul 5 YUL-LHR-YUL</span>
                </div>
                <textarea
                  value={rosterText}
                  onChange={e => setRosterText(e.target.value)}
                  placeholder={"Jun 30 YUL-CDG-YUL\nJul 2 YUL-LHR-YUL"}
                  rows={5}
                  style={{ width: "100%", boxSizing: "border-box", background: C.navy, border: `1px solid ${C.navyBorder}`, borderRadius: 10, color: C.white, padding: "11px 14px", fontSize: 13, outline: "none", marginBottom: 12, fontFamily: "monospace", resize: "vertical" }}
                />
                <button onClick={handleTextParse} disabled={!rosterText.trim()}
                  style={{ width: "100%", padding: "14px", background: rosterText.trim() ? C.gold : C.navyBorder, color: rosterText.trim() ? C.navy : C.muted, border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: rosterText.trim() ? "pointer" : "default" }}
                >Parse Pairings →</button>
              </>
            )}
          </div>
        )}

        {phase === "parsing" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <div style={{ color: C.gold, fontWeight: 600, fontSize: 16 }}>{t.roster_parsing}</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 8 }}>This takes about 5 seconds…</div>
          </div>
        )}

        {phase === "confirm" && (
          <div>
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>✈️ {t.roster_confirm_title}</div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>{t.roster_confirm_hint}</div>

            {parseErrors.length > 0 && (
              <div style={{ background: "rgba(255,100,100,0.08)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
                <div style={{ color: "#ff8080", fontWeight: 600, fontSize: 12, marginBottom: 6 }}>⚠️ {parseErrors.length} line{parseErrors.length > 1 ? "s" : ""} couldn&apos;t be parsed:</div>
                {parseErrors.map((e, i) => (
                  <div key={i} style={{ fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: C.white, fontFamily: "monospace" }}>{e.line}</span><br />
                    <span style={{ color: "#ff8080" }}>↳ {e.message}</span>
                  </div>
                ))}
              </div>
            )}

            {pairings.map((p, i) => {
              const isEditing = editingIdx === i;
              return (
                <div key={i} style={{ background: C.navy, borderRadius: 12, padding: "12px 14px", marginBottom: 10, border: isEditing ? `1px solid ${C.gold}` : `1px solid ${C.navyBorder}` }}>
                  {!isEditing ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>
                            {p.pairingDate} → {p.returnDate || "?"}
                            <span style={{ marginLeft: 8, background: "rgba(255,213,79,0.15)", color: C.gold, fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 5 }}>
                              {p.pairingDays} day{p.pairingDays !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div style={{ color: C.muted, fontSize: 12, marginTop: 5 }}>
                            ✈️ {p.departure} → {(p.destinations || []).join(" → ")}
                            {p.goingUsa === "yes" && <span style={{ marginLeft: 6 }}>🇺🇸 USA</span>}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 8 }}>
                          <button
                            onClick={() => { setEditDraft({ ...p, destinations: (p.destinations || []).join(", ") }); setEditingIdx(i); }}
                            style={{ background: "rgba(255,213,79,0.12)", color: C.gold, border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                          >{t.roster_edit}</button>
                          <button
                            onClick={() => setPairings(prev => prev.filter((_, idx) => idx !== i))}
                            style={{ background: "rgba(255,80,80,0.1)", color: "#ff6b6b", border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                          >{t.roster_delete}</button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ color: C.gold, fontWeight: 700, fontSize: 13, marginBottom: 2 }}>✏️ {t.roster_edit} Pairing #{i + 1}</div>

                      <div>
                        <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>{t.roster_depart_label}</div>
                        <input
                          value={editDraft.pairingDate || ""}
                          onChange={e => {
                            const d = e.target.value;
                            const start = new Date(d), end = new Date(editDraft.returnDate || d);
                            const days = isNaN(start) || isNaN(end) ? editDraft.pairingDays : Math.max(1, Math.round((end - start) / 86400000) + 1);
                            setEditDraft(prev => ({ ...prev, pairingDate: d, pairingDays: days }));
                          }}
                          style={inputStyle}
                          placeholder="2025-06-15"
                        />
                      </div>

                      <div>
                        <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>{t.roster_return_label}</div>
                        <input
                          value={editDraft.returnDate || ""}
                          onChange={e => {
                            const d = e.target.value;
                            const start = new Date(editDraft.pairingDate || d), end = new Date(d);
                            const days = isNaN(start) || isNaN(end) ? editDraft.pairingDays : Math.max(1, Math.round((end - start) / 86400000) + 1);
                            setEditDraft(prev => ({ ...prev, returnDate: d, pairingDays: days }));
                          }}
                          style={inputStyle}
                          placeholder="2025-06-17"
                        />
                      </div>

                      <div>
                        <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>{t.roster_dest_label}</div>
                        <input
                          value={editDraft.destinations || ""}
                          onChange={e => setEditDraft(prev => ({ ...prev, destinations: e.target.value }))}
                          style={inputStyle}
                          placeholder="London, Dubai"
                        />
                      </div>

                      <div>
                        <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>{t.roster_going_usa}</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {["yes", "no"].map(v => (
                            <button
                              key={v}
                              onClick={() => setEditDraft(prev => ({ ...prev, goingUsa: v }))}
                              style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", background: editDraft.goingUsa === v ? C.gold : C.navyMid, color: editDraft.goingUsa === v ? C.navy : C.muted }}
                            >{v === "yes" ? "🇺🇸 Yes" : "No"}</button>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button
                          onClick={() => {
                            const dest = typeof editDraft.destinations === "string"
                              ? editDraft.destinations.split(",").map(s => s.trim()).filter(Boolean)
                              : editDraft.destinations || [];
                            const updated = { ...editDraft, destinations: dest };
                            setPairings(prev => prev.map((x, idx) => idx === i ? updated : x));
                            setEditingIdx(null); setEditDraft(null);
                          }}
                          style={{ flex: 1, padding: "10px", background: C.gold, color: C.navy, border: "none", borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                        >{t.roster_save_edit}</button>
                        <button
                          onClick={() => { setEditingIdx(null); setEditDraft(null); }}
                          style={{ flex: 1, padding: "10px", background: C.navyMid, color: C.muted, border: `1px solid ${C.navyBorder}`, borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                        >{t.roster_cancel_edit}</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => {
                const blank = { pairingDate: "", returnDate: "", pairingDays: 1, departure: homeBase, destinations: "", goingUsa: "no", timezone: 0 };
                setPairings(prev => [...prev, blank]);
                setEditDraft({ ...blank });
                setEditingIdx(pairings.length);
              }}
              style={{ width: "100%", padding: "11px", background: "transparent", color: C.gold, border: `1px dashed ${C.gold}`, borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 12 }}
            >{t.roster_add_pairing}</button>

            <button
              onClick={handleConfirm}
              disabled={editingIdx !== null || pairings.length === 0}
              style={{ width: "100%", padding: "14px", background: editingIdx === null && pairings.length > 0 ? C.gold : C.navyBorder, color: editingIdx === null && pairings.length > 0 ? C.navy : C.muted, border: "none", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: editingIdx === null && pairings.length > 0 ? "pointer" : "default" }}
            >
              {t.roster_confirm_all}
            </button>
          </div>
        )}

        {phase === "saving" && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>💾</div>
            <div style={{ color: C.gold, fontWeight: 600 }}>{t.roster_saving}</div>
          </div>
        )}

        {phase === "done" && (
          <div style={{ padding: "8px 0" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>🗓️</div>
              <div style={{ color: C.gold, fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{t.roster_done_title}</div>
              <div style={{ color: C.muted, fontSize: 13 }}>{t.roster_done_subtitle}</div>
            </div>

            <div style={{ marginBottom: 20 }}>
              {pairings.map((p, i) => {
                const dateStr = p.pairingDate ? new Date(p.pairingDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : p.pairingDate;
                const retStr = p.returnDate ? new Date(p.returnDate).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "?";
                const route = [p.departure, ...(p.destinations || [])].join(" → ");
                return (
                  <div key={i} style={{ background: C.navy, borderRadius: 12, padding: "14px 16px", marginBottom: 10, borderLeft: `3px solid ${C.gold}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>
                        {dateStr} – {retStr}
                      </div>
                      <div style={{ background: "rgba(255,213,79,0.15)", color: C.gold, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>
                        {p.pairingDays} day{p.pairingDays > 1 ? "s" : ""}
                      </div>
                    </div>
                    <div style={{ color: C.muted, fontSize: 12, marginBottom: 10 }}>
                      ✈️ {route}{p.goingUsa === "yes" ? " 🇺🇸" : ""}
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {[
                        { icon: "📧", label: "Reminder email" },
                        { icon: "👆", label: "Tap kitchen" },
                        { icon: "🍽️", label: "Plan arrives" },
                      ].map((step, si) => (
                        <div key={si} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: C.muted }}>
                          {si > 0 && <span style={{ color: C.navyBorder, marginRight: 1 }}>→</span>}
                          <span>{step.icon}</span>
                          <span style={{ color: "#a8b5c8" }}>{step.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: "rgba(255,213,79,0.08)", border: `1px solid rgba(255,213,79,0.2)`, borderRadius: 10, padding: "12px 14px", marginBottom: 20, textAlign: "center" }}>
              <div style={{ color: C.gold, fontSize: 12, fontWeight: 600, marginBottom: 2 }}>How it works</div>
              <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{t.roster_done_flow}</div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowGymPlan(true)} style={{ flex: 1, padding: "14px", background: "#1E3A6E", color: C.gold, border: `1px solid ${C.gold}`, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                💪 {t.gym_plan_btn}
              </button>
              <button onClick={onClose} style={{ flex: 1, padding: "14px", background: C.gold, color: C.navy, border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>{t.roster_done_btn}</button>
            </div>

            {showGymPlan && (
              <GymPlanModal t={t} user={user} month={pairings[0] ? new Date(pairings[0].pairingDate).toISOString().slice(0, 7) : null} onClose={() => setShowGymPlan(false)} />
            )}
          </div>
        )}

        {phase === "error" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <div style={{ color: C.red, fontWeight: 600, marginBottom: parseErrors.length > 0 ? 12 : 20 }}>{errMsg}</div>
            {parseErrors.length > 0 && (
              <div style={{ background: "rgba(255,100,100,0.08)", border: "1px solid rgba(255,100,100,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, textAlign: "left" }}>
                {parseErrors.map((e, i) => (
                  <div key={i} style={{ fontSize: 11, marginBottom: 6 }}>
                    <span style={{ color: C.white, fontFamily: "monospace" }}>{e.line}</span><br />
                    <span style={{ color: "#ff8080" }}>↳ {e.message}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => { setPhase("upload"); setParseErrors([]); }} style={{ padding: "12px 32px", background: C.navy, border: `1px solid ${C.navyBorder}`, color: C.white, borderRadius: 12, cursor: "pointer" }}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GYM PLAN MODAL ───────────────────────────────────────────────

const MUSCLE_COLORS = {
  Chest: "#E8804A", Triceps: "#C96A6A", Shoulders: "#9B7ED9",
  Legs: "#4A9ECC", Glutes: "#CC7EB8", Calves: "#4ABCCC",
  Core: "#E8C96A", Back: "#4ACC8E", Biceps: "#7EB8CC",
  Cardio: "#E84A4A", Flexibility: "#4ACC6E",
};

const DAY_TYPE_LABELS = {
  off:      { emoji: "🏋️", label: "Full Workout",   color: "#4A9ECC" },
  layover:  { emoji: "🏨", label: "Hotel Circuit",  color: "#E8C96A" },
  pairing:  { emoji: "✈️",  label: "Stretch Only",  color: "#7A8EAA" },
  rest:     { emoji: "😴",  label: "Rest",           color: "#4ACC8E" },
};

function GymPlanModal({ t, user, month, onClose, onUploadRoster }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeEx, setActiveEx] = useState(null);
  // Defaults to the current calendar month so the plan is reachable directly
  // (e.g. from a FAB) without re-uploading a roster just to look it up again.
  const resolvedMonth = month || new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`${API_BASE}/api/gym-plan/get?email=${encodeURIComponent(user.email)}&month=${resolvedMonth}`)
      .then(r => r.json())
      .then(d => { if (d.found && d.plan) setPlan(d.plan); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.email, resolvedMonth]);

  const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 300, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 16, overflowY: "auto" };
  const card = { background: C.navyMid, borderRadius: 20, padding: "24px 20px", width: "100%", maxWidth: 480, margin: "20px 0", position: "relative" };

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={card}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer" }}>✕</button>
        <div style={{ color: C.gold, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>💪 {t.gym_plan_title}</div>
        <div style={{ color: C.muted, fontSize: 12, marginBottom: 20 }}>Tailored to your roster schedule</div>

        {loading && <div style={{ textAlign: "center", padding: "40px 0", color: C.muted }}>Loading your plan…</div>}

        {!loading && !plan && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{onUploadRoster ? "💪" : "⏳"}</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: onUploadRoster ? 16 : 0 }}>
              {onUploadRoster
                ? t.gym_plan_none_msg
                : "Your gym plan is being generated. Check back in a moment."}
            </div>
            {onUploadRoster && (
              <button onClick={onUploadRoster} style={{ padding: "12px 24px", background: C.gold, color: C.navy, border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                {t.roster_upload_btn}
              </button>
            )}
          </div>
        )}

        {plan && (plan.weeks || []).map((week, wi) => (
          <div key={wi} style={{ marginBottom: 24 }}>
            <div style={{ color: "#7A8EAA", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
              Week of {new Date(week.weekStart).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            </div>
            {(week.days || []).map((day, di) => {
              const meta = DAY_TYPE_LABELS[day.type] || DAY_TYPE_LABELS.rest;
              const hasWorkout = day.workout && day.workout.exercises?.length > 0;
              return (
                <div key={di} style={{ background: C.navy, borderRadius: 12, padding: "14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: hasWorkout ? 12 : 0 }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>
                        {new Date(day.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                      </span>
                      <span style={{ marginLeft: 8, fontSize: 11, color: meta.color, fontWeight: 600 }}>
                        {meta.emoji} {day.workout?.title || t.gym_plan_rest}
                      </span>
                    </div>
                    {hasWorkout && (
                      <span style={{ fontSize: 11, color: C.muted }}>{day.workout.duration}</span>
                    )}
                  </div>

                  {hasWorkout && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                      {(day.workout.exercises || []).map((ex, ei) => {
                        const thumbUrl = ex.vid ? `https://img.youtube.com/vi/${ex.vid}/hqdefault.jpg` : null;
                        const watchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + " exercise proper form")}`;
                        const muscleColor = MUSCLE_COLORS[ex.muscle] || C.gold;
                        const isActive = activeEx === `${wi}-${di}-${ei}`;
                        return (
                          <div key={ei} style={{ background: "#0A1628", borderRadius: 8, overflow: "hidden", border: `1px solid ${isActive ? muscleColor : C.navyBorder}`, cursor: "pointer" }}
                            onClick={() => setActiveEx(isActive ? null : `${wi}-${di}-${ei}`)}>
                            {thumbUrl && (
                              <div style={{ position: "relative" }}>
                                <img src={thumbUrl} alt={ex.name}
                                  style={{ width: "100%", display: "block", height: 70, objectFit: "cover", objectPosition: "center" }}
                                  onError={e => { e.target.style.display = "none"; }} />
                                <a href={watchUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                                  style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)", color: "#fff", fontSize: 18, textDecoration: "none", opacity: 0 }}
                                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                                  onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                                  ▶
                                </a>
                              </div>
                            )}
                            <div style={{ padding: "6px 7px" }}>
                              <div style={{ color: C.white, fontSize: 10, fontWeight: 700, lineHeight: 1.3, marginBottom: 2 }}>{ex.name}</div>
                              <div style={{ color: C.muted, fontSize: 10 }}>{ex.sets}×{ex.reps}</div>
                              {isActive && (
                                <>
                                  {ex.notes && <div style={{ color: C.gold, fontSize: 10, marginTop: 3, lineHeight: 1.4 }}>{ex.notes}</div>}
                                  <a href={watchUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                                    style={{ display: "inline-block", marginTop: 4, fontSize: 10, color: "#4A9ECC", textDecoration: "none", fontWeight: 600 }}>
                                    ▶ {t.gym_plan_watch}
                                  </a>
                                </>
                              )}
                              <div style={{ marginTop: 3 }}>
                                <span style={{ fontSize: 9, color: muscleColor, fontWeight: 700 }}>{ex.muscle}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FOOD DATABASE (local, no API) ───────────────────────────────
const FOOD_DB = [
  // CHOCOLATE
  { name: "Chocolate – Dark (70%+)", calories: 170, unit: "1 oz / 28 g", tags: ["chocolate","dark"] },
  { name: "Chocolate – Milk", calories: 155, unit: "1 oz / 28 g", tags: ["chocolate","milk chocolate"] },
  { name: "Chocolate – White", calories: 158, unit: "1 oz / 28 g", tags: ["chocolate","white chocolate"] },
  { name: "Hot Chocolate", calories: 190, unit: "1 mug / 240 ml", tags: ["chocolate","cocoa","hot choc"] },
  { name: "Chocolate Chip Cookie", calories: 148, unit: "1 cookie", tags: ["chocolate","cookie","biscuit"] },
  { name: "Chocolate Muffin", calories: 340, unit: "1 medium muffin", tags: ["chocolate","muffin","cake"] },
  // COFFEE & TEA
  { name: "Coffee – Black", calories: 2, unit: "1 cup / 240 ml", tags: ["coffee","black","americano"] },
  { name: "Coffee – With Milk", calories: 50, unit: "1 cup / 240 ml", tags: ["coffee","milk"] },
  { name: "Coffee – Latte (whole milk)", calories: 190, unit: "12 oz latte", tags: ["coffee","latte"] },
  { name: "Coffee – Latte (skim milk)", calories: 100, unit: "12 oz latte", tags: ["coffee","latte","skim"] },
  { name: "Coffee – Cappuccino", calories: 120, unit: "12 oz", tags: ["coffee","cappuccino"] },
  { name: "Coffee – Flat White", calories: 150, unit: "12 oz", tags: ["coffee","flat white"] },
  { name: "Coffee – Espresso", calories: 5, unit: "1 shot / 30 ml", tags: ["coffee","espresso"] },
  { name: "Coffee – Americano", calories: 10, unit: "12 oz", tags: ["coffee","americano"] },
  { name: "Coffee – Mocha", calories: 290, unit: "12 oz", tags: ["coffee","mocha"] },
  { name: "Coffee – Frappuccino", calories: 370, unit: "16 oz (large)", tags: ["coffee","frappuccino","frappe","cold"] },
  { name: "Coffee – Cold Brew (black)", calories: 5, unit: "12 oz", tags: ["coffee","cold brew"] },
  { name: "Tea – Black (no milk)", calories: 2, unit: "1 cup / 240 ml", tags: ["tea","black tea"] },
  { name: "Tea – With Milk", calories: 40, unit: "1 cup / 240 ml", tags: ["tea","milk tea"] },
  { name: "Tea – Chai Latte", calories: 240, unit: "12 oz", tags: ["tea","chai","latte"] },
  { name: "Tea – Green", calories: 2, unit: "1 cup / 240 ml", tags: ["tea","green tea"] },
  // EGGS
  { name: "Egg – Fried (1)", calories: 90, unit: "1 large egg", tags: ["egg","fried egg"] },
  { name: "Egg – Boiled (1)", calories: 78, unit: "1 large egg", tags: ["egg","boiled","hard boiled"] },
  { name: "Egg – Scrambled (2 eggs)", calories: 182, unit: "2 large eggs + butter", tags: ["egg","scrambled"] },
  { name: "Egg – Poached (1)", calories: 72, unit: "1 large egg", tags: ["egg","poached"] },
  { name: "Omelette – Plain (2 eggs)", calories: 186, unit: "2-egg omelette", tags: ["egg","omelette","omelet"] },
  { name: "Omelette – Cheese & Ham", calories: 280, unit: "2-egg omelette + fillings", tags: ["egg","omelette","cheese","ham"] },
  // CHICKEN
  { name: "Chicken Breast – Grilled", calories: 165, unit: "100 g", tags: ["chicken","breast","grilled"] },
  { name: "Chicken Breast – Baked", calories: 158, unit: "100 g", tags: ["chicken","breast","baked"] },
  { name: "Chicken Thigh – Grilled", calories: 209, unit: "100 g", tags: ["chicken","thigh"] },
  { name: "Chicken – Fried (1 piece)", calories: 320, unit: "~120 g piece", tags: ["chicken","fried","crispy"] },
  { name: "Chicken Nuggets (6 pcs)", calories: 280, unit: "6 nuggets", tags: ["chicken","nuggets"] },
  { name: "Chicken Sandwich", calories: 440, unit: "1 sandwich", tags: ["chicken","sandwich"] },
  { name: "Chicken Wrap", calories: 380, unit: "1 wrap", tags: ["chicken","wrap"] },
  // BEEF / STEAK
  { name: "Beef Steak – Sirloin", calories: 207, unit: "100 g grilled", tags: ["beef","steak","sirloin"] },
  { name: "Beef Steak – Ribeye", calories: 263, unit: "100 g grilled", tags: ["beef","steak","ribeye"] },
  { name: "Ground Beef (lean)", calories: 215, unit: "100 g cooked", tags: ["beef","ground","mince","minced"] },
  { name: "Burger – Beef", calories: 490, unit: "1 quarter-pounder", tags: ["burger","beef","hamburger"] },
  { name: "Burger – Cheeseburger", calories: 540, unit: "1 burger", tags: ["burger","cheeseburger","beef","cheese"] },
  { name: "Burger – Chicken", calories: 430, unit: "1 burger", tags: ["burger","chicken"] },
  { name: "Burger – Veggie", calories: 380, unit: "1 burger", tags: ["burger","veggie","vegetarian"] },
  // FISH & SEAFOOD
  { name: "Salmon – Grilled", calories: 206, unit: "100 g", tags: ["salmon","fish","grilled"] },
  { name: "Salmon – Smoked", calories: 117, unit: "100 g", tags: ["salmon","fish","smoked"] },
  { name: "Tuna – Canned in Water", calories: 116, unit: "100 g drained", tags: ["tuna","fish","canned"] },
  { name: "Tuna – Canned in Oil", calories: 198, unit: "100 g drained", tags: ["tuna","fish","canned","oil"] },
  { name: "Shrimp / Prawns (cooked)", calories: 99, unit: "100 g", tags: ["shrimp","prawn","seafood"] },
  // GRAINS & LEGUMES
  { name: "Rice – White (cooked)", calories: 206, unit: "1 cup / 186 g", tags: ["rice","white rice"] },
  { name: "Rice – Brown (cooked)", calories: 216, unit: "1 cup / 195 g", tags: ["rice","brown rice"] },
  { name: "Pasta – Plain (cooked)", calories: 220, unit: "1 cup / 140 g", tags: ["pasta","spaghetti","noodle"] },
  { name: "Pasta – Tomato Sauce", calories: 310, unit: "1 cup pasta + sauce", tags: ["pasta","tomato","marinara"] },
  { name: "Pasta – Carbonara", calories: 480, unit: "1 serving", tags: ["pasta","carbonara","cream"] },
  { name: "Quinoa (cooked)", calories: 222, unit: "1 cup / 185 g", tags: ["quinoa","grain"] },
  { name: "Lentils (cooked)", calories: 230, unit: "1 cup / 198 g", tags: ["lentils","legume","bean"] },
  { name: "Chickpeas (cooked)", calories: 269, unit: "1 cup / 164 g", tags: ["chickpeas","legume","bean"] },
  { name: "Oatmeal – Plain", calories: 166, unit: "1 cup cooked", tags: ["oatmeal","oats","porridge"] },
  { name: "Oatmeal – With Honey & Banana", calories: 280, unit: "1 cup cooked + toppings", tags: ["oatmeal","oats","porridge","honey","banana"] },
  // BREAD & BAKERY
  { name: "Bread – White Slice", calories: 79, unit: "1 slice / 30 g", tags: ["bread","white","toast"] },
  { name: "Bread – Whole Wheat Slice", calories: 69, unit: "1 slice / 28 g", tags: ["bread","whole wheat","wholemeal","toast"] },
  { name: "Bread – Sourdough Slice", calories: 85, unit: "1 slice / 35 g", tags: ["bread","sourdough","toast"] },
  { name: "Baguette (portion)", calories: 140, unit: "2 oz / 56 g", tags: ["bread","baguette","french"] },
  { name: "Dinner Roll", calories: 100, unit: "1 roll / 35 g", tags: ["bread","roll"] },
  { name: "Bagel – Plain", calories: 245, unit: "1 medium", tags: ["bagel","bread"] },
  { name: "Bagel – Everything", calories: 260, unit: "1 medium", tags: ["bagel","bread","everything"] },
  { name: "Croissant – Plain", calories: 272, unit: "1 medium", tags: ["croissant","pastry"] },
  { name: "Croissant – Butter", calories: 290, unit: "1 medium", tags: ["croissant","pastry","butter"] },
  { name: "Muffin – Blueberry", calories: 340, unit: "1 medium", tags: ["muffin","blueberry"] },
  { name: "Muffin – Bran", calories: 305, unit: "1 medium", tags: ["muffin","bran"] },
  { name: "Pancake (1 plain)", calories: 90, unit: "1 medium / 40 g", tags: ["pancake","breakfast","crepe"] },
  { name: "Waffle (1)", calories: 218, unit: "1 round / 75 g", tags: ["waffle","breakfast"] },
  // DAIRY
  { name: "Milk – Whole", calories: 149, unit: "1 cup / 240 ml", tags: ["milk","whole milk"] },
  { name: "Milk – 2%", calories: 122, unit: "1 cup / 240 ml", tags: ["milk","2%","semi-skimmed"] },
  { name: "Milk – Skim / Nonfat", calories: 83, unit: "1 cup / 240 ml", tags: ["milk","skim","nonfat"] },
  { name: "Milk – Almond", calories: 30, unit: "1 cup / 240 ml", tags: ["milk","almond milk","plant milk"] },
  { name: "Milk – Oat", calories: 120, unit: "1 cup / 240 ml", tags: ["milk","oat milk"] },
  { name: "Yogurt – Greek, Plain (full-fat)", calories: 190, unit: "170 g", tags: ["yogurt","greek","plain"] },
  { name: "Yogurt – Greek, Plain (0% fat)", calories: 100, unit: "170 g", tags: ["yogurt","greek","nonfat"] },
  { name: "Yogurt – Flavored (fruit)", calories: 170, unit: "170 g", tags: ["yogurt","flavored","fruit"] },
  { name: "Cheese – Cheddar", calories: 113, unit: "1 oz / 28 g", tags: ["cheese","cheddar"] },
  { name: "Cheese – Mozzarella", calories: 85, unit: "1 oz / 28 g", tags: ["cheese","mozzarella"] },
  { name: "Cheese – Feta", calories: 75, unit: "1 oz / 28 g", tags: ["cheese","feta"] },
  { name: "Cheese – Parmesan", calories: 110, unit: "1 oz / 28 g", tags: ["cheese","parmesan"] },
  { name: "Butter", calories: 102, unit: "1 tbsp / 14 g", tags: ["butter","dairy"] },
  // FRUITS
  { name: "Apple – Small", calories: 77, unit: "1 small / 149 g", tags: ["apple","fruit"] },
  { name: "Apple – Medium", calories: 95, unit: "1 medium / 182 g", tags: ["apple","fruit"] },
  { name: "Apple – Large", calories: 116, unit: "1 large / 223 g", tags: ["apple","fruit"] },
  { name: "Banana – Small", calories: 72, unit: "1 small / 100 g", tags: ["banana","fruit"] },
  { name: "Banana – Medium", calories: 105, unit: "1 medium / 118 g", tags: ["banana","fruit"] },
  { name: "Banana – Large", calories: 121, unit: "1 large / 136 g", tags: ["banana","fruit"] },
  { name: "Orange – Medium", calories: 62, unit: "1 medium / 131 g", tags: ["orange","citrus","fruit"] },
  { name: "Grapes", calories: 104, unit: "1 cup / 151 g", tags: ["grapes","fruit"] },
  { name: "Strawberries", calories: 49, unit: "1 cup / 152 g", tags: ["strawberries","berries","fruit"] },
  { name: "Blueberries", calories: 84, unit: "1 cup / 148 g", tags: ["blueberries","berries","fruit"] },
  { name: "Mango (cubed)", calories: 99, unit: "1 cup / 165 g", tags: ["mango","fruit"] },
  { name: "Watermelon", calories: 86, unit: "2 cups / 280 g", tags: ["watermelon","melon","fruit"] },
  { name: "Avocado – Half", calories: 114, unit: "½ medium avocado", tags: ["avocado","fruit"] },
  { name: "Avocado – Whole", calories: 227, unit: "1 medium avocado", tags: ["avocado","fruit"] },
  // VEGETABLES
  { name: "Broccoli (steamed)", calories: 55, unit: "1 cup / 156 g", tags: ["broccoli","vegetable","veg"] },
  { name: "Spinach (raw)", calories: 7, unit: "1 cup / 30 g", tags: ["spinach","leafy green","vegetable","veg"] },
  { name: "Carrots (raw)", calories: 52, unit: "1 medium carrot", tags: ["carrot","carrots","vegetable","veg"] },
  { name: "Sweet Potato (baked)", calories: 103, unit: "1 medium / 130 g", tags: ["sweet potato","yam","vegetable","veg"] },
  { name: "Potato – Baked", calories: 161, unit: "1 medium / 173 g", tags: ["potato","baked potato","vegetable"] },
  { name: "French Fries (medium)", calories: 320, unit: "~117 g serving", tags: ["fries","french fries","chips","potato"] },
  // SALADS
  { name: "Salad – Garden (no dressing)", calories: 20, unit: "1 bowl", tags: ["salad","garden","green","greens"] },
  { name: "Salad – Caesar", calories: 360, unit: "1 entrée bowl", tags: ["salad","caesar"] },
  { name: "Salad – Greek", calories: 180, unit: "1 bowl", tags: ["salad","greek"] },
  { name: "Dressing – Vinaigrette", calories: 75, unit: "2 tbsp", tags: ["dressing","vinaigrette","salad"] },
  { name: "Dressing – Ranch", calories: 130, unit: "2 tbsp", tags: ["dressing","ranch","salad"] },
  // SANDWICHES & WRAPS
  { name: "Sandwich – Ham & Cheese", calories: 350, unit: "1 sandwich", tags: ["sandwich","ham","cheese"] },
  { name: "Sandwich – Turkey", calories: 290, unit: "1 sandwich", tags: ["sandwich","turkey"] },
  { name: "Sandwich – BLT", calories: 360, unit: "1 sandwich", tags: ["sandwich","blt","bacon"] },
  { name: "Sandwich – Tuna", calories: 370, unit: "1 sandwich", tags: ["sandwich","tuna","fish"] },
  { name: "Sandwich – Veggie", calories: 270, unit: "1 sandwich", tags: ["sandwich","veggie","vegetarian"] },
  // PIZZA
  { name: "Pizza – Margherita (slice)", calories: 240, unit: "1 slice / ~107 g", tags: ["pizza","margherita","cheese"] },
  { name: "Pizza – Pepperoni (slice)", calories: 298, unit: "1 slice / ~107 g", tags: ["pizza","pepperoni","meat"] },
  { name: "Pizza – Veggie (slice)", calories: 215, unit: "1 slice / ~107 g", tags: ["pizza","veggie","vegetarian"] },
  // SOUPS
  { name: "Soup – Tomato", calories: 74, unit: "1 cup / 248 g", tags: ["soup","tomato"] },
  { name: "Soup – Chicken Noodle", calories: 75, unit: "1 cup / 244 g", tags: ["soup","chicken","noodle"] },
  { name: "Soup – Vegetable", calories: 60, unit: "1 cup", tags: ["soup","vegetable","veg"] },
  { name: "Soup – Lentil", calories: 139, unit: "1 cup", tags: ["soup","lentil"] },
  { name: "Soup – Pho", calories: 215, unit: "1 bowl", tags: ["soup","pho","vietnamese","noodle"] },
  // SNACKS
  { name: "Hummus", calories: 70, unit: "2 tbsp / 30 g", tags: ["hummus","dip","snack"] },
  { name: "Crackers – Whole Wheat (5)", calories: 90, unit: "5 crackers / 20 g", tags: ["crackers","whole wheat","snack"] },
  { name: "Crackers – Regular (5)", calories: 70, unit: "5 crackers", tags: ["crackers","snack"] },
  { name: "Rice Cake (1)", calories: 35, unit: "1 cake / 9 g", tags: ["rice cake","snack"] },
  { name: "Chips – Potato", calories: 155, unit: "1 oz / 28 g", tags: ["chips","crisps","potato","snack"] },
  { name: "Chips – Tortilla / Nachos", calories: 140, unit: "1 oz / 28 g", tags: ["chips","tortilla","nachos","snack"] },
  { name: "Popcorn (air-popped)", calories: 31, unit: "1 cup / 8 g", tags: ["popcorn","snack"] },
  { name: "Granola Bar", calories: 190, unit: "1 bar / ~47 g", tags: ["granola","bar","snack"] },
  { name: "Protein Bar", calories: 220, unit: "1 bar / ~60 g", tags: ["protein","bar","snack"] },
  // NUTS & SEEDS
  { name: "Almonds", calories: 164, unit: "1 oz / 28 g (~23 nuts)", tags: ["almonds","nuts","snack"] },
  { name: "Cashews", calories: 157, unit: "1 oz / 28 g (~18 nuts)", tags: ["cashews","nuts","snack"] },
  { name: "Peanuts", calories: 161, unit: "1 oz / 28 g", tags: ["peanuts","nuts","snack"] },
  { name: "Walnuts", calories: 185, unit: "1 oz / 28 g (~14 halves)", tags: ["walnuts","nuts","snack"] },
  { name: "Mixed Nuts", calories: 173, unit: "1 oz / 28 g", tags: ["mixed nuts","nuts","snack"] },
  { name: "Peanut Butter", calories: 188, unit: "2 tbsp / 32 g", tags: ["peanut butter","nut butter","snack"] },
  // SWEETS & DESSERTS
  { name: "Ice Cream – Vanilla (½ cup)", calories: 137, unit: "½ cup / 66 g", tags: ["ice cream","vanilla","dessert"] },
  { name: "Ice Cream – Chocolate (½ cup)", calories: 143, unit: "½ cup / 66 g", tags: ["ice cream","chocolate","dessert"] },
  { name: "Ice Cream – Strawberry (½ cup)", calories: 127, unit: "½ cup / 66 g", tags: ["ice cream","strawberry","dessert"] },
  { name: "Snickers Bar", calories: 250, unit: "1 bar / 52 g", tags: ["snickers","chocolate","candy","snack"] },
  { name: "Kit Kat (4 fingers)", calories: 210, unit: "1 pack / 41 g", tags: ["kit kat","kitkat","chocolate","wafer","candy"] },
  { name: "M&Ms", calories: 240, unit: "1.69 oz bag / 48 g", tags: ["m&ms","candy","chocolate"] },
  { name: "Donut – Glazed", calories: 269, unit: "1 donut / 60 g", tags: ["donut","doughnut","glazed","sweet"] },
  { name: "Cookie – Oatmeal Raisin", calories: 133, unit: "1 cookie / 44 g", tags: ["cookie","oatmeal","raisin","biscuit"] },
  // DRINKS
  { name: "Orange Juice", calories: 112, unit: "1 cup / 240 ml", tags: ["juice","orange juice","oj","drink"] },
  { name: "Apple Juice", calories: 114, unit: "1 cup / 240 ml", tags: ["juice","apple juice","drink"] },
  { name: "Cola / Soda", calories: 140, unit: "12 fl oz / 355 ml can", tags: ["soda","cola","coke","pepsi","fizzy","drink"] },
  { name: "Diet Cola / Diet Soda", calories: 0, unit: "12 fl oz / 355 ml can", tags: ["diet soda","diet cola","diet coke","zero","drink"] },
  { name: "Energy Drink – Red Bull", calories: 110, unit: "8.4 fl oz / 250 ml", tags: ["energy drink","red bull","drink"] },
  { name: "Energy Drink – Monster", calories: 210, unit: "16 fl oz / 473 ml", tags: ["energy drink","monster","drink"] },
  { name: "Beer – Regular", calories: 154, unit: "12 fl oz / 355 ml", tags: ["beer","lager","ale","alcohol","drink"] },
  { name: "Beer – Light", calories: 103, unit: "12 fl oz / 355 ml", tags: ["beer","light beer","alcohol","drink"] },
  { name: "Wine – Red", calories: 125, unit: "5 fl oz / 150 ml glass", tags: ["wine","red wine","alcohol","drink"] },
  { name: "Wine – White", calories: 121, unit: "5 fl oz / 150 ml glass", tags: ["wine","white wine","alcohol","drink"] },
  { name: "Smoothie – Fruit", calories: 270, unit: "300 ml", tags: ["smoothie","fruit","drink","shake"] },
  { name: "Smoothie – Green", calories: 200, unit: "300 ml", tags: ["smoothie","green","spinach","drink","shake"] },
  { name: "Protein Shake (whey + water)", calories: 130, unit: "1 scoop in 300 ml water", tags: ["protein","shake","whey","drink"] },
  { name: "Water", calories: 0, unit: "any amount", tags: ["water","drink","mineral water"] },
  // FAST FOOD & WORLD CUISINE
  { name: "Subway 6\" Turkey Sub", calories: 280, unit: "6-inch sub", tags: ["subway","turkey","sandwich","fast food"] },
  { name: "McDonald's Big Mac", calories: 550, unit: "1 burger", tags: ["mcdonalds","big mac","burger","fast food"] },
  { name: "McDonald's Fries (medium)", calories: 320, unit: "medium portion", tags: ["mcdonalds","fries","chips","fast food"] },
  { name: "Sushi Roll (6 pieces)", calories: 255, unit: "6-piece roll", tags: ["sushi","roll","japanese","fish"] },
  { name: "Spring Roll (fried)", calories: 100, unit: "1 roll", tags: ["spring roll","fried","asian"] },
  { name: "Tacos – Chicken (2)", calories: 360, unit: "2 soft tacos", tags: ["taco","tacos","chicken","mexican"] },
  { name: "Burrito – Chicken", calories: 490, unit: "1 burrito", tags: ["burrito","chicken","mexican"] },
  { name: "Pad Thai (takeaway)", calories: 430, unit: "1 serving", tags: ["pad thai","noodle","thai","asian"] },
];

function loadDailyLog() {
  try {
    const saved = localStorage.getItem("nc_daily_cal");
    if (!saved) return [];
    const { date, items } = JSON.parse(saved);
    return date === new Date().toDateString() ? (items || []) : [];
  } catch { return []; }
}

function saveDailyLog(items) {
  try {
    localStorage.setItem("nc_daily_cal", JSON.stringify({ date: new Date().toDateString(), items }));
  } catch {}
}

// ─── CALORIE MODAL ────────────────────────────────────────────────
function CalorieModal({ t, text, setText, result, loading, onEstimate, onClose, calorieTarget }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dailyLog, setDailyLog] = useState(() => loadDailyLog());
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    setSuggestions(
      FOOD_DB.filter(f => f.name.toLowerCase().includes(q) || f.tags.some(tag => tag.includes(q))).slice(0, 8)
    );
  }, [query]);

  const addToLog = (food) => {
    const next = [...dailyLog, { ...food, id: Date.now() }];
    setDailyLog(next); saveDailyLog(next);
    setQuery(""); setSuggestions([]);
  };
  const removeFromLog = (id) => {
    const next = dailyLog.filter(e => e.id !== id);
    setDailyLog(next); saveDailyLog(next);
  };
  const clearLog = () => { setDailyLog([]); saveDailyLog([]); };

  const total = dailyLog.reduce((s, e) => s + e.calories, 0);
  const pct = calorieTarget ? Math.min(100, Math.round((total / calorieTarget) * 100)) : null;
  const over = calorieTarget && total > calorieTarget;

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modal, maxHeight: "88vh", overflowY: "auto", gap: 12, padding: 0 }}>
        <div style={{
          ...styles.modalHeader, padding: "18px 20px 14px",
          position: "sticky", top: 0, background: C.navyMid, zIndex: 10,
          borderBottom: `1px solid ${C.navyBorder}`,
        }}>
          <span style={styles.modalTitle}>{t.calorie_title}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: "14px 20px 20px", display: "flex", flexDirection: "column", gap: 12 }}>

        {/* SEARCH INPUT */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search food (e.g. chocolate, egg, coffee)…"
            style={{
              width: "100%", boxSizing: "border-box",
              background: C.navyMid, color: C.white,
              border: `1px solid ${C.navyBorder}`, borderRadius: 10,
              padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none",
            }}
          />
          {suggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 2px)", left: 0, right: 0, zIndex: 200,
              background: C.navyCard, border: `1px solid ${C.navyBorder}`,
              borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            }}>
              {suggestions.map(food => (
                <button key={food.name} onClick={() => addToLog(food)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", background: "none", border: "none",
                  borderBottom: `1px solid ${C.navyBorder}`, color: C.white,
                  padding: "10px 14px", cursor: "pointer", textAlign: "left", fontSize: 13,
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{food.name}</div>
                    <div style={{ color: C.muted, fontSize: 11 }}>{food.unit}</div>
                  </div>
                  <div style={{ color: C.gold, fontWeight: 700, whiteSpace: "nowrap", marginLeft: 10 }}>
                    +{food.calories} kcal
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DAILY LOG */}
        {dailyLog.length > 0 && (
          <div style={{ background: C.navyCard, borderRadius: 10, border: `1px solid ${C.navyBorder}`, overflow: "hidden" }}>
            <div style={{
              padding: "9px 14px", borderBottom: `1px solid ${C.navyBorder}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "1px" }}>
                Today's Intake
              </span>
              <button onClick={clearLog} style={{ background: "none", border: "none", color: C.muted, fontSize: 11, cursor: "pointer" }}>
                Clear all
              </button>
            </div>
            {dailyLog.map(entry => (
              <div key={entry.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 14px", borderBottom: `1px solid ${C.navyBorder}22`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.white }}>{entry.name}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{entry.unit}</div>
                </div>
                <span style={{ color: C.gold, fontWeight: 600, fontSize: 13, marginRight: 10 }}>{entry.calories} kcal</span>
                <button onClick={() => removeFromLog(entry.id)} style={{
                  background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 0,
                }}>×</button>
              </div>
            ))}
            <div style={{ padding: "12px 14px" }}>
              {pct !== null && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginBottom: 4 }}>
                    <span>Progress toward daily target</span>
                    <span style={{ color: over ? C.red : C.green, fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: C.navyBorder, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3, transition: "width 0.3s",
                      width: `${pct}%`,
                      background: over ? C.red : pct > 80 ? C.gold : C.green,
                    }} />
                  </div>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 13, color: C.muted }}>Total today</span>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: over ? C.red : C.gold }}>{total.toLocaleString()}</span>
                  <span style={{ fontSize: 13, color: C.muted }}> kcal</span>
                  {calorieTarget && (
                    <div style={{ fontSize: 11, color: C.muted }}>of {calorieTarget.toLocaleString()} target</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI ESTIMATE (collapsible) */}
        <button onClick={() => setShowAI(v => !v)} style={{
          background: "none", border: `1px solid ${C.navyBorder}`, borderRadius: 8,
          color: C.muted, fontSize: 12, padding: "8px 12px", cursor: "pointer",
          textAlign: "left", width: "100%", fontFamily: "inherit",
        }}>
          {showAI ? "▾" : "▸"} Can't find it? Estimate by description (AI)
        </button>

        {showAI && (
          <>
            <textarea style={styles.calorieInput} value={text}
              onChange={e => setText(e.target.value)}
              placeholder={t.calorie_placeholder} rows={3}/>
            <button style={styles.primaryBtn} onClick={onEstimate} disabled={loading || !text.trim()}>
              {loading ? "..." : t.calorie_btn}
            </button>
            {result && result.error && (
              <div>
                <div style={styles.calorieError}>{t.calorie_error}</div>
                <button style={{ ...styles.primaryBtn, marginTop: 8 }} onClick={onEstimate}>{t.try_again}</button>
              </div>
            )}
            {result && !result.error && (
              <div style={styles.calorieResult}>
                <div style={styles.calResultTotal}>≈ {result.total} kcal</div>
                {result.breakdown?.map((item, i) => (
                  <div key={i} style={styles.calBreakdown}>
                    <span>{item.food}</span>
                    <span style={{ color: C.gold }}>{item.calories} kcal</span>
                  </div>
                ))}
                {result.note && <div style={styles.calNote}>{result.note}</div>}
                {result.total > 0 && (
                  <button onClick={() => {
                    const entry = { name: text.slice(0, 60), calories: result.total, unit: "AI estimate", id: Date.now() };
                    const next = [...dailyLog, entry];
                    setDailyLog(next); saveDailyLog(next);
                  }} style={{
                    marginTop: 10, width: "100%", background: C.navyMid,
                    border: `1px solid ${C.gold}`, borderRadius: 8, color: C.gold,
                    padding: "9px", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    + Add to Today's Intake
                  </button>
                )}
              </div>
            )}
          </>
        )}

        <div style={styles.calorieDisclaimer}>{t.calorie_disclaimer}</div>
        </div>{/* end inner padding div */}
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
          <div>
            <div style={styles.calorieError}>{t.airplane_meal_error}</div>
            <button style={{ ...styles.primaryBtn, marginTop: 8 }} onClick={onCheck}>{t.try_again}</button>
          </div>
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

function JetlagModal({ t, pairing, user, lang, isPremium, onClose, onRequirePremium }) {
  const tz = parseInt(pairing.timezone || 0, 10);
  const hasJetlag = Math.abs(tz) >= 4;
  const tips = [t.jetlag_tip_1, t.jetlag_tip_2, t.jetlag_tip_3, t.jetlag_tip_4, t.jetlag_tip_5];
  const destination = (pairing.destinations || [])[0];

  const [mealPlan, setMealPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState(false);

  useEffect(() => {
    if (!hasJetlag || !isPremium || !user?.email || !destination) return;
    setLoadingPlan(true);
    setPlanError(false);
    fetch(`${API_BASE}/api/jetlag-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email, departure: pairing.departure, destination,
        timezone: tz, diets: pairing.diets || [], lang: lang || "en",
      }),
    })
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setMealPlan(d); })
      .catch(() => setPlanError(true))
      .finally(() => setLoadingPlan(false));
  }, [hasJetlag, isPremium, user?.email, pairing.departure, destination, tz]); // eslint-disable-line

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

            {isPremium ? (
              <div style={styles.restrictCard}>
                <div style={styles.restrictTitle}>🌍 Your Personalized Meal-Timing Plan</div>
                {loadingPlan && <div style={styles.restrictText}>Building your plan…</div>}
                {planError && <div style={styles.restrictText}>Could not load your personalized plan. Try again later.</div>}
                {mealPlan && (
                  <>
                    <div style={{...styles.restrictText, marginBottom: 10}}>{mealPlan.summary}</div>
                    {mealPlan.schedule?.map((entry, i) => (
                      <div key={i} style={{marginBottom: 10}}>
                        <div style={{color: C.gold, fontWeight: 600, fontSize: 13, marginBottom: 4}}>{entry.label}</div>
                        {entry.actions?.map((a, ai) => (
                          <div key={ai} style={styles.jetlagTipRow}>
                            <span style={{color:C.gold}}>•</span>
                            <span style={styles.restrictText}>{a}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div style={styles.nearbyLock}>
                <div style={{fontSize: 32, marginBottom: 8}}>👑</div>
                <div style={styles.nearbyLockTitle}>Personalized Jetlag Meal Plan</div>
                <div style={styles.nearbyLockMsg}>Upgrade to Premium for a meal-timing plan built specifically for this {Math.abs(tz)}-hour time difference.</div>
                <button style={{...styles.primaryBtn, marginTop: 12}} onClick={onRequirePremium}>Upgrade</button>
              </div>
            )}
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

function PlanHistoryModal({ t, onClose, onOpen }) {
  const plans = getSavedPlans();
  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modal, maxHeight: "88vh" }}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>📋 {t.history_title}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {plans.length === 0 ? (
          <div style={styles.restrictCard}>
            <div style={styles.restrictText}>{t.history_empty}</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "65vh", overflowY: "auto", paddingRight: 2 }}>
            {plans.map((saved, i) => {
              const dep = saved.data?.departure || "";
              const dests = saved.data?.destinations || [];
              const days = saved.data?.pairing_days || 1;
              const depCode = dep.match(/\(([A-Z]{3})\)/)?.[1] || dep.slice(0, 3).toUpperCase() || "—";
              const dst = dests[0] || "";
              const dstCode = dst.match(/\(([A-Z]{3})\)/)?.[1] || dst.slice(0, 3).toUpperCase() || "—";
              const extraStops = dests.length - 1;
              const date = saved.createdAt
                ? new Date(saved.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })
                : "—";
              return (
                <div
                  key={saved.key || i}
                  onClick={() => onOpen(saved)}
                  style={{ background: C.navyCard, borderRadius: 12, padding: "14px 16px", border: `1px solid ${C.navyBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", gap: 12 }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, letterSpacing: "0.5px" }}>{date}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: "1px", fontFamily: "'Orbitron', sans-serif" }}>
                      {depCode} → {dstCode}
                    </div>
                    {extraStops > 0 && (
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                        +{extraStops} more stop{extraStops > 1 ? "s" : ""}
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: C.sky, marginTop: 4, fontWeight: 600 }}>
                      {days} {days === 1 ? t.day : t.days}
                    </div>
                  </div>
                  <div style={{ color: C.gold, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                    {t.history_open} →
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ReferralModal({ t, referralCode, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = referralCode
    ? `${window.location.origin}/?ref=${referralCode}`
    : window.location.origin;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {}
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modal }}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>✈️ {t.referral_title}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎁</div>
          <div style={{ color: C.white, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{t.referral_title}</div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>{t.referral_desc}</div>

          {referralCode && (
            <div style={{ background: C.navyCard, border: `1px solid ${C.gold}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontFamily: "'Orbitron', monospace", fontSize: 22, fontWeight: 800, color: C.gold, letterSpacing: "4px" }}>
              {referralCode}
            </div>
          )}

          <div style={{ background: C.navyMid, border: `1px solid ${C.navyBorder}`, borderRadius: 8, padding: "8px 12px", marginBottom: 16, fontSize: 12, color: C.muted, wordBreak: "break-all", textAlign: "left" }}>
            {shareUrl}
          </div>

          <button
            style={{ ...styles.primaryBtn, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            onClick={copyLink}
          >
            {copied ? `✓ ${t.referral_copied}` : `📋 ${t.referral_copy}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function FAQModal({ t, lang, onClose }) {
  const [openIndex, setOpenIndex] = useState(null);
  const items = FAQ[lang] || FAQ.en;

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.modal }}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>❓ {t.faq_heading}</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: "8px 0 16px" }}>
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} style={styles.faqItem}>
                <button style={styles.faqQuestion} onClick={() => setOpenIndex(isOpen ? null : i)}>
                  <span>{item.q}</span>
                  <span style={{ color: C.gold }}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <div style={styles.faqAnswer}>{item.a}</div>}
              </div>
            );
          })}
        </div>
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
  const [lunchBag, setLunchBag] = useState(user?.lunch_bag || "");
  const [cookingPref, setCookingPref] = useState(user?.cooking_pref || "");
  const [diets, setDiets] = useState(user?.diets || []);
  const [dietOther, setDietOther] = useState(user?.diet_other || "");
  const [goals, setGoals] = useState(user?.goals || []);
  const [budgetType, setBudgetType] = useState(user?.budget_type || "day");
  const [budgetAmount, setBudgetAmount] = useState(user?.budget_amount || "");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleSetPassword = async () => {
    if (newPassword.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setPwError("Passwords don't match."); return; }
    setPwSaving(true);
    setPwError("");
    try {
      const sess = storage.get(SESSION_KEY);
      const res = await fetch(`${API_BASE}/api/auth/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, password: newPassword, token: sess?.token }),
      });
      const data = await res.json();
      if (!res.ok) { setPwError(data.error || "Failed to set password."); return; }
      setPwSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      storage.set(PASSWORD_PROMPT_DISMISSED_KEY, true);
      onSave({ hasPassword: true });
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setPwSaving(false);
    }
  };

  const onDietsChange = (v) => {
    let next = v;
    if (v.includes("none") && !diets.includes("none")) next = ["none"];
    else if (diets.includes("none") && v.length > 1) next = v.filter(d => d !== "none");
    setDiets(next);
  };

  const handleSave = () => {
    onSave({
      gender,
      weight: weightVal ? `${weightVal}${weightUnit}` : user?.weight,
      position,
      lunch_bag: lunchBag,
      cooking_pref: cookingPref,
      diets,
      diet_other: dietOther,
      goals,
      budget_type: budgetType,
      budget_amount: budgetAmount,
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

        <div>
          <div style={styles.inputLabel}>Password</div>
          {!showPasswordForm ? (
            <button style={styles.secondaryBtn} onClick={() => { setShowPasswordForm(true); setPwSuccess(false); }}>
              {user?.hasPassword ? "Change Password" : "Set a Password"}
            </button>
          ) : (
            <div>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>🔒</span>
                <input style={styles.input} type="password" placeholder="New password (8+ characters)"
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} autoComplete="new-password"/>
              </div>
              <div style={{...styles.inputWrap, marginTop: 10}}>
                <span style={styles.inputIcon}>🔒</span>
                <input style={styles.input} type="password" placeholder="Confirm password"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password"/>
              </div>
              {pwError && <div style={{ color: "#F87171", fontSize: 13, marginTop: 8 }}>{pwError}</div>}
              {pwSuccess && <div style={{ color: C.gold, fontSize: 13, marginTop: 8 }}>Password saved.</div>}
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button style={{...styles.primaryBtn, flex: 1, justifyContent: "center"}} onClick={handleSetPassword} disabled={pwSaving}>
                  {pwSaving ? "Saving…" : "Save"}
                </button>
                <button style={{...styles.secondaryBtn, flex: 1, justifyContent: "center"}} onClick={() => { setShowPasswordForm(false); setPwError(""); setNewPassword(""); setConfirmPassword(""); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
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

        <RadioGroup label={t.step_lunch_bag}
          options={[
            {v:"small",  l:t.bag_small,  icon:"👜"},
            {v:"medium", l:t.bag_medium, icon:"🎒"},
            {v:"large",  l:t.bag_large,  icon:"🧳"},
          ]}
          value={lunchBag}
          onChange={setLunchBag}/>

        <RadioGroup label={t.step_cooking_pref}
          options={[
            {v:"enjoys_cooking",l:t.cooking_enjoy,icon:"👨‍🍳"},
            {v:"simple_recipes",l:t.cooking_simple,icon:"⏱️"},
          ]}
          value={cookingPref}
          onChange={setCookingPref}/>

        {/* calorie_deficit isn't editable here — it needs the TDEE-based
            CalorieTargetStep sub-flow, not just a checkbox, to set a target */}
        <CheckGroup label={t.step_diet}
          options={[
            {v:"none",l:t.no_restrictions,icon:"🍽️"},
            {v:"vegetarian",l:t.vegetarian,icon:"🥗"},
            {v:"vegan",l:t.vegan,icon:"🌱"},
            {v:"halal",l:t.halal,icon:"☪️"},
            {v:"kosher",l:t.kosher,icon:"✡️"},
            {v:"low_carb",l:t.low_carb,icon:"🥑"},
            {v:"mediterranean",l:t.mediterranean,icon:"🫒"},
            {v:"carnivore",l:t.carnivore,icon:"🥩"},
            {v:"paleo",l:t.paleo,icon:"🦴"},
            {v:"other",l:t.diet_other,icon:"✏️"},
          ]}
          values={diets}
          onChange={onDietsChange}/>
        <div style={{ color: C.gold, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginTop: 18, marginBottom: 8 }}>
          🚨 {t.allergies_section}
        </div>
        <CheckGroup label=""
          options={[
            {v:"gluten_free",l:t.gluten_free,icon:"🌾"},
            {v:"dairy_free",l:t.dairy_free,icon:"🧀"},
            {v:"lactose_free",l:t.lactose_free,icon:"🥛"},
            {v:"nut_free",l:t.nut_free,icon:"🥜"},
            {v:"egg_free",l:t.egg_free,icon:"🥚"},
            {v:"shellfish_free",l:t.shellfish_free,icon:"🦐"},
            {v:"soy_free",l:t.soy_free,icon:"🫘"},
            {v:"fodmap",l:t.fodmap,icon:"🌿"},
          ]}
          values={diets}
          onChange={onDietsChange}/>
        {diets.includes("other") && (
          <div style={{marginTop:12}}>
            <TextInput value={dietOther} onChange={setDietOther}
              placeholder={t.diet_other_placeholder} icon="✏️"/>
          </div>
        )}

        <CheckGroup label={t.step_goals}
          options={[
            {v:"lose_weight",l:t.lose_weight,icon:"⚖️"},
            {v:"keep_weight",l:t.keep_weight,icon:"🎯"},
            {v:"gain_weight",l:t.gain_weight,icon:"📈"},
            {v:"stay_focused",l:t.stay_focused,icon:"🧠"},
            {v:"no_bloating",l:t.no_bloating,icon:"💨"},
            {v:"energy",l:t.energy,icon:"⚡"},
            {v:"muscle",l:t.muscle,icon:"💪"},
            {v:"sleep",l:t.sleep,icon:"😴"},
          ]}
          values={goals}
          onChange={setGoals}/>

        <div>
          <div style={styles.inputLabel}>{t.step_budget}</div>
          <div style={styles.unitToggle}>
            {["day","total"].map(u => (
              <button key={u}
                style={{...styles.unitBtn, ...(budgetType===u?styles.unitBtnActive:{})}}
                onClick={() => setBudgetType(u)}>
                {u === "day" ? t.budget_day : t.budget_total}
              </button>
            ))}
          </div>
          <TextInput value={budgetAmount} type="number"
            onChange={setBudgetAmount}
            placeholder="50" icon="💰"/>
        </div>

        <button style={styles.primaryBtn} onClick={handleSave}>{t.save_profile}</button>
      </div>
    </div>
  );
}

// ─── DUTY SCHEDULE STEP ───────────────────────────────────────────
const DUTY_HOURS = Array.from({ length: 11 }, (_, i) => String(i + 6));
const DUTY_BTN_BASE = { padding: "9px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, border: `1.5px solid ${C.navyBorder}`, background: "transparent", color: C.muted };
const DUTY_BTN_ACTIVE = { ...DUTY_BTN_BASE, background: C.gold, color: C.navy, border: `1.5px solid ${C.gold}` };
const DUTY_HR_BTN = { padding: "7px 10px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, border: `1.5px solid ${C.navyBorder}`, background: "transparent", color: C.muted };
const DUTY_HR_BTN_ACTIVE = { ...DUTY_HR_BTN, background: C.gold, color: C.navy, border: `1.5px solid ${C.gold}` };

function DutyScheduleStep({ t, pairing, upd }) {

  return (
    <div>
      <div style={styles.inputLabel}>{t.step_duty}</div>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 16 }}>Optional — helps us time meals around your duty window.</div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ ...styles.hint, marginBottom: 6 }}>{t.duty_report}</div>
        <input
          type="time"
          value={pairing.report_time || ""}
          onChange={e => upd("report_time", e.target.value)}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 10, background: C.navyCard, color: pairing.report_time ? C.white : C.muted, border: `1.5px solid ${C.navyBorder}`, fontSize: 14, boxSizing: "border-box", colorScheme: "dark", outline: "none" }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ ...styles.hint, marginBottom: 6 }}>{t.duty_length}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {DUTY_HOURS.map(h => (
            <button key={h} style={pairing.duty_hours === h ? DUTY_HR_BTN_ACTIVE : DUTY_HR_BTN}
              onClick={() => upd("duty_hours", h)}>{h}h</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ ...styles.hint, marginBottom: 6 }}>{t.duty_layover}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["short", t.layover_short], ["standard", t.layover_standard], ["long", t.layover_long]].map(([v, l]) => (
            <button key={v} style={pairing.layover_type === v ? DUTY_BTN_ACTIVE : DUTY_BTN_BASE}
              onClick={() => upd("layover_type", v)}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ ...styles.hint, marginBottom: 6 }}>{t.duty_direction}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["east", t.dir_east, "→"], ["west", t.dir_west, "←"], ["ns", t.dir_ns, "↕"]].map(([v, l, ic]) => (
            <button key={v} style={pairing.flight_direction === v ? DUTY_BTN_ACTIVE : DUTY_BTN_BASE}
              onClick={() => upd("flight_direction", v)}>{ic} {l}</button>
          ))}
        </div>
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
  const dob = pairing.dob || user?.dob;
  const age = dob
    ? Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000))
    : parseInt(pairing.age || user?.age || 35, 10);

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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000); // 45s max
  let res;
  try {
    res = await fetch(`${API_BASE}/api/generate-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, lang }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    if (res.status === 403 && body?.error === "premium_required") {
      throw Object.assign(new Error("premium_required"), { code: "premium_required", pairingCount: body.pairingCount });
    }
    throw new Error("Failed to generate plan");
  }
  const result = await res.json().catch(() => { throw new Error("Invalid response from server"); });
  if (!result || !Array.isArray(result.days) || result.days.length === 0) throw new Error("Incomplete plan response");
  return result;
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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  let res;
  try {
    res = await fetch(`${API_BASE}/api/estimate-calories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  let res;
  try {
    res = await fetch(`${API_BASE}/api/check-airplane-meal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
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
  footerLinksRow: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 28,
  },
  contactLink: {
    background: "none", border: "none", padding: 0, cursor: "pointer",
    fontSize: 13, color: C.muted, fontFamily: "inherit",
    textDecoration: "underline", textUnderlineOffset: 3,
  },
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
  selectionChip: {
    background: C.navyCard, border: `1px solid ${C.navyBorder}`, borderRadius: 20,
    padding: "5px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", color: C.muted,
  },
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
    width: 58, height: 58, borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.navyCard}, ${C.navyMid})`,
    border: `1.5px solid ${C.gold}`, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 4px 16px ${C.gold}33`, zIndex: 100,
  },
  floatBtnJetlag: {
    position: "fixed", bottom: 90, right: 20,
    width: 58, height: 58, borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.navyCard}, ${C.navyMid})`,
    border: `1.5px solid ${C.gold}`, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 4px 16px ${C.gold}33`, zIndex: 100,
  },
  floatBtnSaved: {
    position: "fixed", bottom: 156, right: 20,
    width: 58, height: 58, borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.navyCard}, ${C.navyMid})`,
    border: `1.5px solid ${C.gold}`, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 4px 16px ${C.gold}33`, zIndex: 100,
  },
  floatLabelSaved: {
    position: "fixed", bottom: 176, right: 84, zIndex: 100,
    background: C.navyCard, color: C.gold, fontSize: 14, fontWeight: 700,
    padding: "5px 12px", borderRadius: 12, border: `1px solid ${C.gold}`, whiteSpace: "nowrap",
  },
  floatBtnRoster: {
    position: "fixed", bottom: 224, right: 20,
    width: 58, height: 58, borderRadius: "50%", fontSize: 28,
    background: `linear-gradient(135deg, ${C.navyCard}, ${C.navyMid})`,
    border: `1.5px solid ${C.gold}`, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 4px 16px ${C.gold}33`, zIndex: 100,
  },
  floatBtnRosterCrown: {
    position: "fixed", bottom: 270, right: 16, fontSize: 18, zIndex: 101,
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
  },
  floatLabelRoster: {
    position: "fixed", bottom: 244, right: 84, zIndex: 100,
    background: C.navyCard, color: C.gold, fontSize: 14, fontWeight: 700,
    padding: "5px 12px", borderRadius: 12, border: `1px solid ${C.gold}`, whiteSpace: "nowrap",
  },
  floatBtnGymPlan: {
    position: "fixed", bottom: 292, right: 20,
    width: 58, height: 58, borderRadius: "50%", fontSize: 28,
    background: `linear-gradient(135deg, ${C.navyCard}, ${C.navyMid})`,
    border: `1.5px solid ${C.gold}`, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: `0 4px 16px ${C.gold}33`, zIndex: 100,
  },
  floatBtnGymPlanCrown: {
    position: "fixed", bottom: 338, right: 16, fontSize: 18, zIndex: 101,
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
  },
  floatLabelGymPlan: {
    position: "fixed", bottom: 312, right: 84, zIndex: 100,
    background: C.navyCard, color: C.gold, fontSize: 14, fontWeight: 700,
    padding: "5px 12px", borderRadius: 12, border: `1px solid ${C.gold}`, whiteSpace: "nowrap",
  },
  floatBtnJetlagBadge: {
    position: "fixed", bottom: 86, right: 14, fontSize: 18, zIndex: 101,
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))",
  },
  floatLabelJetlag: {
    position: "fixed", bottom: 110, right: 84, zIndex: 100,
    background: C.navyCard, color: C.gold, fontSize: 14, fontWeight: 700,
    padding: "5px 12px", borderRadius: 12, border: `1px solid ${C.gold}`, whiteSpace: "nowrap",
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
  faqItem: {
    borderBottom: `1px solid ${C.navyBorder}`, padding: "12px 0",
  },
  faqQuestion: {
    width: "100%", background: "none", border: "none", cursor: "pointer",
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
    textAlign: "left", fontSize: 14, fontWeight: 600, color: C.white,
    fontFamily: "inherit", padding: 0,
  },
  faqAnswer: {
    marginTop: 10, fontSize: 13, color: C.muted, lineHeight: 1.5, textAlign: "left",
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
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
`;
