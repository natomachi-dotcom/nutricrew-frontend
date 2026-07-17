import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoAsPremiumUser, completeNewPairing } from "./fixtures.js";

// Regression test for a production bug: the floating action button stack
// (Calorie, Jetlag, Saved, Roster, Gym Plan — up to 5 buttons, position:fixed,
// bottom-right) grew over time without the plan screen's bottom padding
// growing with it, so the buttons ended up sitting on top of meal card
// content at the bottom of the page — including the "tap an ingredient
// you're allergic to" row and its chips.
//
// Uses a realistic ingredient count (the backend's MEAL_SCHEMA requires
// listing every distinct ingredient, however minor — a real meal typically
// has 5-8, not the 3-item fixtures.js default) so the chip row actually
// wraps wide enough to reach the FAB column, matching what production saw.
const PLAN = structuredClone(MOCK_PLAN);
PLAN.days[0].meals[3].ingredients = ["Greek yogurt", "almonds", "honey", "chia seeds", "cinnamon", "granola", "blueberries"];
PLAN.days[0].meals[3].container = "250ml round container with clip lid";

test("floating action buttons never overlap meal card content at 390px width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12/13-class viewport

  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: PLAN });
  });

  // Nut-Free triggers the "tap an ingredient you're allergic to" row on the
  // almond-containing Snack meal — the row this bug report specifically
  // called "unacceptable" to obscure. lunch_bag set so the container-size
  // text (also reported as obscured) renders too.
  await gotoAsPremiumUser(page, { diets: ["nut_free"], lunch_bag: "small" });
  await completeNewPairing(page);
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();

  // Expand every meal card so all their content (including the last one,
  // most at-risk of being covered by the FAB stack) is in the DOM.
  for (const name of ["Oatmeal with Berries", "Grilled Chicken Salad", "Baked Salmon with Quinoa", "Greek Yogurt with Almonds"]) {
    await page.getByText(name).click();
  }
  await expect(page.getByRole("button", { name: /almonds ✕/ })).toBeVisible();

  // Scroll all the way down — the worst case for a fixed-position overlay.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

  const fabLabels = ["calorie estimator", "jet lag info", "saved meals", "roster upload", "gym plan"];
  const fabBoxes = [];
  for (const label of fabLabels) {
    const btn = page.getByRole("button", { name: label });
    if (await btn.count() > 0 && await btn.isVisible()) {
      fabBoxes.push({ label, box: await btn.boundingBox() });
    }
  }
  expect(fabBoxes.length).toBeGreaterThan(0); // sanity: the stack actually rendered

  function overlaps(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  // Whole-card check: the entire visual card for the last (most at-risk) meal
  // must not be covered by any FAB — a button sitting on the card's
  // background is just as much a bug as one sitting on specific text, since
  // it can clip/obscure whatever's underneath regardless of exact wrapping.
  const lastCard = page.locator("text=Greek Yogurt with Almonds").locator("xpath=ancestor::div[contains(@style,'border-radius') or position()=6][1]");
  const almondChipHandle = await page.getByRole("button", { name: /almonds ✕/ }).elementHandle();
  const cardBox = await almondChipHandle.evaluate((el) => {
    let node = el;
    for (let i = 0; i < 5 && node.parentElement; i++) node = node.parentElement;
    const r = node.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  for (const { label, box: fabBox } of fabBoxes) {
    expect(overlaps(cardBox, fabBox), `meal card ${JSON.stringify(cardBox)} overlaps FAB "${label}" ${JSON.stringify(fabBox)}`).toBe(false);
  }

  // Specific elements the bug report named directly.
  const contentLocators = [
    page.getByText("Tap an ingredient you're allergic to"),
    page.getByRole("button", { name: /almonds ✕/ }),
    page.getByRole("button", { name: /blueberries ✕/ }), // last chip in the wrapped row — furthest right/lowest
    page.getByText("protein-rich").first(),
    page.getByText("250ml round container with clip lid"),
  ];

  for (const locator of contentLocators) {
    await expect(locator).toBeVisible();
    const box = await locator.boundingBox();
    for (const { label, box: fabBox } of fabBoxes) {
      expect(overlaps(box, fabBox), `content ${JSON.stringify(box)} overlaps FAB "${label}" ${JSON.stringify(fabBox)}`).toBe(false);
    }
  }
});
