import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoAsPremiumUser, completeNewPairing } from "./fixtures.js";

// Customs/import rules are derived automatically from the destination (no
// user question — see premium-gate.spec.js and onboarding.spec.js for the
// absence of any USA/country question in the check-in flow itself). These
// tests cover the OTHER half of that feature: the derived rules must be
// clearly displayed, labeled by country, with the actual restrictions in
// plain language — not just silently applied.

test("a US destination pairing shows a clearly labeled USA customs section with the actual rules", async ({ page }) => {
  const plan = {
    ...MOCK_PLAN,
    days: [{ ...MOCK_PLAN.days[0], label: "Day 1 — Fort Lauderdale" }],
    foodRestrictions: {
      usa: "No fresh fruit, no fresh vegetables, no raw meat.",
      destination: "N/A",
      general: "Stay hydrated and avoid excess sodium while traveling.",
      usaApplies: true,
      carried: "Your bag crosses a restricted border on this pairing: USA (CBP/USDA) (Day 1).\n\nAny food packed at home or carried between stops must clear ALL of these customs checkpoints.",
      byCountry: [
        {
          id: "usa", name: "USA (CBP/USDA)", dayLabel: "Day 1", days: [1], onReturn: false,
          bans: [
            "Any fresh fruit (apples, oranges, mangoes, bananas, grapes, berries, citrus, stone fruits, etc.)",
            "Raw or undercooked meat, poultry, or seafood",
          ],
        },
      ],
    },
  };
  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: plan });
  });

  await gotoAsPremiumUser(page);
  await completeNewPairing(page, { destination: "Fort Lauderdale (FLL)" });
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Fort Lauderdale")).toBeVisible();

  // No customs/country question was ever asked to reach this point — see
  // completeNewPairing in fixtures.js, which has no such step.

  await page.getByRole("button", { name: "Food Rules" }).click();
  // "USA (CBP/USDA)" appears both in the combined carried-food note and in
  // the per-country card's own heading — .last() targets the card.
  await expect(page.getByText("USA (CBP/USDA)").last()).toBeVisible();
  await expect(page.getByText("Any fresh fruit (apples, oranges, mangoes, bananas, grapes, berries, citrus, stone fruits, etc.)")).toBeVisible();
  await expect(page.getByText("Raw or undercooked meat, poultry, or seafood")).toBeVisible();

  // The day-level connection: the plan tab itself notes WHY today's packed
  // items are constrained, not just the Food Rules tab in isolation.
  await page.getByRole("button", { name: "Meal Plan" }).click();
  await expect(page.getByText("Packed items today must clear", { exact: false })).toBeVisible();
  await expect(page.getByText("🇺🇸 USA (CBP/USDA)")).toBeVisible();
});

test("a multi-country pairing (YUL -> FLL -> NRT) shows both USA and Japan restrictions plus the combined carried-food rule naming both countries", async ({ page }) => {
  const plan = {
    ...MOCK_PLAN,
    days: [
      { ...MOCK_PLAN.days[0], day: 1, label: "Day 1 — Fort Lauderdale" },
      { ...MOCK_PLAN.days[0], day: 2, label: "Day 2 — Tokyo" },
    ],
    foodRestrictions: {
      usa: "No fresh fruit, no fresh vegetables, no raw meat.",
      destination: "Strict plant quarantine in Japan.",
      general: "Stay hydrated and avoid excess sodium while traveling.",
      usaApplies: true,
      carried: "Your bag crosses multiple restricted borders on this pairing: USA (CBP/USDA) (Day 1); Japan (MAFF quarantine) (Day 2).\n\nAny food packed at home or carried between stops must clear ALL of these customs checkpoints. The following items cannot be packed or carried anywhere on this pairing:\n• Any fresh fruit (apples, oranges, mangoes, bananas, grapes, berries, citrus, stone fruits, etc.)\n• Fresh fruits and vegetables (strict plant quarantine — most prohibited without inspection certificate)",
      byCountry: [
        {
          id: "usa", name: "USA (CBP/USDA)", dayLabel: "Day 1", days: [1], onReturn: false,
          bans: ["Any fresh fruit (apples, oranges, mangoes, bananas, grapes, berries, citrus, stone fruits, etc.)"],
        },
        {
          id: "japan", name: "Japan (MAFF quarantine)", dayLabel: "Day 2", days: [2], onReturn: false,
          bans: ["Fresh fruits and vegetables (strict plant quarantine — most prohibited without inspection certificate)"],
        },
      ],
    },
  };
  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: plan });
  });

  await gotoAsPremiumUser(page);
  await page.getByRole("button", { name: "New Pairing" }).click();
  const continueBtn = page.getByRole("button", { name: "Continue →" });
  await continueBtn.click(); // budget: pre-filled from profile
  await page.getByRole("button", { name: "2 Days" }).click();
  await continueBtn.click();
  await continueBtn.click(); // departure: pre-filled from profile
  const destInputs = page.getByPlaceholder("Where are you flying? (city or airport)");
  await destInputs.nth(0).fill("Fort Lauderdale (FLL)");
  await destInputs.nth(1).fill("Tokyo (NRT)");
  await continueBtn.click();
  await continueBtn.click(); // kitchen access day 1: pre-filled from profile
  await continueBtn.click(); // kitchen access day 2: pre-filled from profile
  await continueBtn.click(); // duty schedule, optional — skip

  // No customs/country question anywhere in that flow.
  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Fort Lauderdale")).toBeVisible();

  await page.getByRole("button", { name: "Food Rules" }).click();

  // The combined carried-food rule names BOTH countries explicitly.
  await expect(page.getByText(/crosses multiple restricted borders/)).toBeVisible();
  await expect(page.getByText(/USA \(CBP\/USDA\) \(Day 1\)/)).toBeVisible();
  await expect(page.getByText(/Japan \(MAFF quarantine\) \(Day 2\)/)).toBeVisible();

  // Both per-country breakdown cards, each with their own actual rules.
  await expect(page.getByText("USA (CBP/USDA)").first()).toBeVisible();
  await expect(page.getByText("Japan (MAFF quarantine)").first()).toBeVisible();
  await expect(page.getByText("Any fresh fruit (apples, oranges, mangoes, bananas, grapes, berries, citrus, stone fruits, etc.)").last()).toBeVisible();
  await expect(page.getByText("Fresh fruits and vegetables (strict plant quarantine — most prohibited without inspection certificate)").last()).toBeVisible();
});
