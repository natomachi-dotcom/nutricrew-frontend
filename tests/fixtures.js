import { expect } from "@playwright/test";

// Realistic /api/generate-plan response shape (matches DAY_SCHEMA / EXTRAS_SCHEMA
// in nutricrew-backend/server.js) for a 1-day Montreal -> Paris pairing.
export const MOCK_PLAN = {
  summary: "A balanced one-day plan with extra hydration and lighter meals to ease jet lag.",
  days: [
    {
      day: 1,
      label: "Day 1 — Paris",
      jetlagNote: "Eat meals on Paris time as soon as possible and get morning sunlight to reset your body clock.",
      totalCalories: 1950,
      meals: [
        {
          type: "Breakfast",
          name: "Oatmeal with Berries",
          description: "Hearty oatmeal topped with mixed berries and nuts.",
          prep: "5 min, microwave",
          calories: 450,
          protein: 15,
          carbs: 60,
          fat: 12,
          tags: ["vegetarian", "high-fiber"],
          tip: "Pack overnight oats the night before departure.",
          recyclingTip: "Rinse and recycle the oat container.",
        },
        {
          type: "Lunch",
          name: "Grilled Chicken Salad",
          description: "Mixed greens with grilled chicken, avocado, and vinaigrette.",
          prep: "10 min prep",
          calories: 600,
          protein: 40,
          carbs: 30,
          fat: 25,
          tags: ["high-protein"],
          tip: "Keep dressing separate until ready to eat.",
          recyclingTip: "Compost the salad greens scraps.",
        },
        {
          type: "Dinner",
          name: "Baked Salmon with Quinoa",
          description: "Baked salmon with quinoa and steamed broccoli.",
          prep: "20 min",
          calories: 700,
          protein: 45,
          carbs: 50,
          fat: 28,
          tags: ["omega-3"],
          tip: "Prep quinoa in bulk for the week.",
          recyclingTip: "Recycle the salmon packaging.",
        },
        {
          type: "Snack",
          name: "Greek Yogurt with Almonds",
          description: "Plain Greek yogurt topped with almonds and honey.",
          prep: "2 min",
          calories: 200,
          protein: 12,
          carbs: 15,
          fat: 8,
          tags: ["protein-rich"],
          ingredients: ["Greek yogurt", "almonds", "honey"],
          tip: "Buy single-serving cups for travel.",
          recyclingTip: "Rinse and recycle the yogurt cup.",
        },
      ],
    },
  ],
  groceryList: {
    produce: ["Bananas", "Spinach", "Broccoli"],
    protein: ["Chicken breast", "Salmon", "Greek yogurt"],
    pantry: ["Oats", "Quinoa", "Almonds"],
    snacks: ["Honey"],
    dairy: ["Greek yogurt"],
  },
  foodRestrictions: {
    usa: "Not applicable — not traveling to the USA",
    destination: "Some dairy and meat products face import restrictions when entering France.",
    general: "Stay hydrated and avoid excess sodium while traveling.",
  },
  pairingCount: 1,
  isPremium: false,
  // Server-computed (see needsPremium in NutriCrew/server.js's
  // canGeneratePairing()): after consuming the 1 free pairing, the account's
  // NEXT attempt needs premium. The client caches this directly from the
  // response — it never derives it from a local limit constant.
  needsPremium: true,
  // Bypasses the mandatory password-setup gate for brand-new accounts (added
  // alongside server-side "Add mandatory password setup for new accounts") —
  // that flow is out of scope for these onboarding tests.
  hasPassword: true,
};

// Clears persisted app state so every test starts as a brand-new user on the splash screen.
export async function gotoFresh(page) {
  await page.addInitScript(() => localStorage.clear());
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Begin Check-In" })).toBeVisible();
}

// Walks through all check-in steps for a new user (Montreal -> Paris, 1-day pairing,
// no kitchen access, no diet restrictions, "stay focused" goal, $50/day budget) and
// lands on the boarding pass screen.
export async function completeCheckIn(page, { name = "Alex Pilot", email = "alex.pilot@example.com" } = {}) {
  const continueBtn = page.getByRole("button", { name: "Continue →" });

  await page.getByRole("button", { name: "Begin Check-In" }).click();

  // name
  await page.getByPlaceholder("John Smith").fill(name);
  await continueBtn.click();

  // email
  await page.getByPlaceholder("john@airline.com").fill(email);
  await continueBtn.click();

  // gender
  await page.getByRole("button", { name: "Male", exact: true }).click();
  await continueBtn.click();

  // weight (defaults to kg, placeholder "70")
  await page.getByPlaceholder("70").fill("75");
  await continueBtn.click();

  // date of birth
  await page.locator('input[type="date"]').fill("1990-01-01");
  await continueBtn.click();

  // position
  await page.getByRole("button", { name: "Pilot" }).click();
  await continueBtn.click();

  // lunch bag size
  await page.getByRole("button", { name: /Small/ }).click();
  await continueBtn.click();

  // cooking preference
  await page.getByRole("button", { name: "I Need Simple Recipes" }).click();
  await continueBtn.click();

  // diet
  await page.getByRole("button", { name: "No Restrictions" }).click();
  await continueBtn.click();

  // goals
  await page.getByRole("button", { name: "Stay Focused & Alert" }).click();
  await continueBtn.click();

  // budget
  await page.getByRole("button", { name: "Per Day" }).click();
  await page.getByPlaceholder("50").fill("50");
  await continueBtn.click();

  // pairing length: 1 day
  await page.getByRole("button", { name: "1 Days" }).click();
  await continueBtn.click();

  // departure
  await page.getByPlaceholder("Montreal (YUL)").fill("Montreal (YUL)");
  await continueBtn.click();

  // destination (1 day -> single field) — starts empty, no default to clear
  await page.getByPlaceholder("Where are you flying? (city or airport)").fill("Paris (CDG)");
  await continueBtn.click();

  // kitchen access (day 1)
  await page.getByRole("button", { name: "Hotel (No Kitchen)" }).click();
  await continueBtn.click();

  // duty schedule (optional) — skip
  await continueBtn.click();

  // boarding pass screen
  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
}

// Seeds a fully-onboarded, already-subscribed (isPremium: true) returning user
// directly into localStorage/session and lands on the splash screen with a
// "New Pairing" button — bypasses the paywall (a brand-new user has no free
// pairing; see premium-gate.spec.js) so tests whose subject is what happens
// AFTER a plan is generated (ingredient exclusion, airplane-meal checker, etc.)
// don't need to re-run full first-time onboarding just to reach that point.
export async function gotoAsPremiumUser(page, overrides = {}) {
  const user = {
    name: "Alex Pilot", email: "alex.pilot@example.com", isPremium: true, hasPassword: true,
    gender: "male", weight: "75kg", dob: "1990-01-01", position: "pilot",
    lunch_bag: "small", cooking_pref: "simple_recipes", diets: ["none"], goals: ["stay_focused"],
    budget_type: "day", budget_amount: "50", departure: "Montreal (YUL)", kitchen: ["hotel"],
    ...overrides,
  };
  await page.route("**/api/auth/verify-session", (route) =>
    route.fulfill({ json: { email: user.email, isPremium: true } })
  );
  await page.addInitScript((u) => {
    localStorage.clear();
    localStorage.setItem("nutricrew_session", JSON.stringify({ token: "test-token", email: u.email }));
    localStorage.setItem("nutricrew_user", JSON.stringify(u));
  }, user);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "New Pairing" })).toBeVisible();
}

// Walks the shortened returning-user "New Pairing" flow (budget → pairing_days
// → departure → destination → kitchen_day_1 → duty_schedule) for a
// 1-day pairing and lands on the boarding pass. Budget/departure/kitchen are
// pre-filled from the seeded profile (gotoAsPremiumUser) — only destination is
// ever left blank by design, so it's the only field this fills in.
export async function completeNewPairing(page, { destination = "Paris (CDG)" } = {}) {
  const continueBtn = page.getByRole("button", { name: "Continue →" });

  await page.getByRole("button", { name: "New Pairing" }).click();
  await continueBtn.click(); // budget: pre-filled from profile
  await page.getByRole("button", { name: "1 Days" }).click();
  await continueBtn.click();
  await continueBtn.click(); // departure: pre-filled from profile
  await page.getByPlaceholder("Where are you flying? (city or airport)").fill(destination);
  await continueBtn.click();
  await continueBtn.click(); // kitchen access (day 1): pre-filled from profile
  await continueBtn.click(); // duty schedule, optional — skip

  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
}
