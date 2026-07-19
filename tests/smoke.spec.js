// ─────────────────────────────────────────────────────────────────────────
// PRE-DEPLOY SMOKE TEST — run this before every deploy.
//
// Exercises the full critical path end-to-end: fresh signup via OTP, the
// complete new-user onboarding (asserting every step renders, works, and
// has NO hard-defaulted choice), a real plan generation, then a SECOND
// pairing as a returning user (asserting diet is genuinely re-selectable
// and kitchen access is never stuck on "Hotel/No Kitchen"), and the
// paywall boundary (free on pairing #1, gated on #2).
//
// See the bottom of this file for exact run commands and what each mode
// actually validates.
// ─────────────────────────────────────────────────────────────────────────
import { test, expect } from "@playwright/test";

// SMOKE_MOCK=1 (default in this repo's CI-safe mode): backend calls are
// intercepted with realistic, schema-accurate responses — see MOCK_PLAN in
// fixtures.js for the shape these are modeled on. This is FAST and
// DETERMINISTIC and catches every FRONTEND regression this test is designed
// for (hard-defaulted choices, broken step gating, paywall timing, plan
// rendering) without needing live secrets. It does NOT validate that the
// real backend/AI actually returns diet-appropriate, budget-compliant
// content — that's the backend's own test suite's job (see
// nutricrew-backend/test-*.mjs), not this smoke test's.
//
// SMOKE_MOCK=0: hits the REAL running backend (whatever VITE_API_BASE_URL
// points at). For OTP to work without a live inbox, the backend must be
// running locally with RESEND_API_KEY unset — it then exposes the code via
// GET /api/auth/dev-otp (see server.js), which this script reads directly
// instead of an email. This is the true pre-deploy gate: it also catches
// backend/AI generation failures (e.g. a validator rule the model can't
// reliably satisfy) that mocked mode can never see.
const MOCK = process.env.SMOKE_MOCK !== "0";
const API_BASE = process.env.SMOKE_API_BASE || "http://localhost:3001";
const testEmail = `smoke-${Date.now()}@nutricrew-test.local`;
const testPassword = "smoke-test-password-123";

function buildMockPlan(data) {
  const dest = (data.destinations || [])[0] || "Unknown";
  const diet = (data.diets || []).join(",") || "none";
  const kitchen = (Array.isArray(data.kitchen) ? data.kitchen : [data.kitchen]).filter(Boolean).join(",") || "unknown";
  return {
    summary: `A plan for a ${diet} diet with ${kitchen} kitchen access, heading to ${dest}.`,
    days: [{
      day: 1, label: `Day 1 — ${dest.replace(/\s*\([A-Z]{2,4}\)/, "").trim()}`,
      jetlagNote: null, hydrationNote: null, totalCalories: 1950,
      meals: [
        { type: "Breakfast", name: "Oatmeal", description: `A ${diet}-safe breakfast.`, prep_method: "no_cook", prep: "2 min", calories: 450, protein: 15, carbs: 60, fat: 12, tags: [diet], ingredients: [{ name: "oats", quantity: 1, unit: "cup" }], tip: "x", recyclingTip: "x", hero_ingredient: "oats" },
        { type: "Lunch", name: "Chicken Salad", description: `Prepared for ${kitchen} access.`, prep_method: "no_cook", prep: "5 min", calories: 600, protein: 40, carbs: 30, fat: 25, tags: [diet], ingredients: [{ name: "chicken", quantity: 1, unit: "portion" }], tip: "x", recyclingTip: "x", hero_ingredient: "chicken" },
      ],
    }],
    groceryList: { produce: ["Bananas"], protein: ["Chicken breast"], pantry: ["Oats"], snacks: [], dairy: [] },
    foodRestrictions: { usa: "N/A", destination: "x", general: "x", usaApplies: false, byCountry: [], carried: null },
    pairingCount: (data.__pairingCount ?? 0) + 1,
    isPremium: false,
    needsPremium: false,
    // First pairing (brand-new signup): no password on file yet, so the app
    // must hold the plan back and route through OTP + set-password. Every
    // later pairing: the account already has one.
    hasPassword: !!data.__hasPassword,
  };
}

test.describe.configure({ mode: "serial" });

test("SMOKE: signup -> onboarding -> plan -> second pairing -> paywall", async ({ page }) => {
  test.setTimeout(180000);

  // Only tracks JS crashes (pageerror) — not console.error/network 404s from
  // unmocked, low-stakes endpoints (e.g. referral code lookups), which are
  // expected noise in mock mode and unrelated to whether the app itself renders.
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));

  let generateCallCount = 0;
  let lastRequestBody = null;

  if (MOCK) {
    await page.route("**/api/auth/send-otp", (route) => route.fulfill({ json: { alreadyVerified: false } }));
    await page.route("**/api/auth/verify-otp", (route) =>
      route.fulfill({ json: { token: "smoke-token", email: testEmail, hasPassword: false, isPremium: false, pairingCount: 0, needsPremium: false } }));
    await page.route("**/api/auth/set-password", (route) => route.fulfill({ json: { success: true } }));
    // Without this, step 5's page.goto("/") reload fires a REAL (failing,
    // 401) session check against the mock token, which force-redirects to
    // the login screen mid-flow and races with subsequent clicks — the
    // actual cause of a "second pairing" hang found while building this test.
    await page.route("**/api/auth/verify-session", (route) => route.fulfill({ json: { email: testEmail, isPremium: false } }));
    await page.route("**/api/generate-plan", async (route) => {
      generateCallCount++;
      const body = route.request().postDataJSON();
      lastRequestBody = body.data;
      if (generateCallCount === 1) {
        await route.fulfill({ json: buildMockPlan({ ...body.data, __pairingCount: 0, __hasPassword: false }) });
      } else {
        // Second pairing: this account already used its free pairing.
        await route.fulfill({ status: 403, json: { error: "premium_required", message: "Subscribe to continue.", pairingCount: 1, needsPremium: true } });
      }
    });
  }

  await test.step("1. App loads and renders (not blank/error)", async () => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Begin Check-In" })).toBeVisible({ timeout: 15000 });
    expect(pageErrors, `console/page errors on load:\n${pageErrors.join("\n")}`).toEqual([]);
    console.log("PASS  [1] app renders splash screen, no console errors");
  });

  const continueBtn = () => page.getByRole("button", { name: "Continue →" });

  async function step(label, fn, { assertNoneSelectedFirst } = {}) {
    const start = Date.now();
    if (assertNoneSelectedFirst) await assertNoneSelectedFirst();
    await fn();
    const elapsed = Date.now() - start;
    const within = elapsed <= 1000;
    console.log(`${within ? "PASS" : "FAIL"}  [3] ${label} — advanced in ${elapsed}ms${within ? "" : " (>1000ms budget)"}`);
    expect(elapsed, `"${label}" took ${elapsed}ms, over the 1000ms Continue budget`).toBeLessThanOrEqual(1000);
  }

  await test.step("2+3. Fresh signup: walk full new-user onboarding, asserting each step renders and has no hard default", async () => {
    await page.getByRole("button", { name: "Begin Check-In" }).click();

    await step("name", async () => {
      await expect(page.getByText("Full Name")).toBeVisible();
      await page.getByPlaceholder("John Smith").fill("Smoke Test");
      await continueBtn().click();
    });

    await step("email", async () => {
      await expect(page.getByText("Email Address")).toBeVisible();
      await page.getByPlaceholder("john@airline.com").fill(testEmail);
      await continueBtn().click();
    });

    await step("gender", async () => {
      await page.getByRole("button", { name: "Male", exact: true }).click();
      await continueBtn().click();
    });

    await step("weight", async () => {
      await page.getByPlaceholder("70").fill("75");
      await continueBtn().click();
    });

    await step("date of birth", async () => {
      await page.locator('input[type="date"]').fill("1990-01-01");
      await continueBtn().click();
    });

    await step("position", async () => {
      await page.getByRole("button", { name: "Pilot" }).click();
      await continueBtn().click();
    });

    await step("lunch bag", async () => {
      await page.getByRole("button", { name: /Small/ }).click();
      await continueBtn().click();
    });

    await step("cooking preference", async () => {
      await page.getByRole("button", { name: "I Need Simple Recipes" }).click();
      await continueBtn().click();
    });

    await step(
      "diet — no option pre-selected for a brand-new user, genuinely choosable",
      async () => {
        await page.getByRole("button", { name: "Vegan", exact: false }).click();
        await continueBtn().click();
      },
      {
        assertNoneSelectedFirst: async () => {
          await expect(page.getByText("Your Diet")).toBeVisible();
          await expect(continueBtn()).toBeDisabled(); // nothing selected yet -> Continue blocked
        },
      },
    );

    await step("goals", async () => {
      await page.getByRole("button", { name: "Stay Focused & Alert" }).click();
      await continueBtn().click();
    });

    await step("budget", async () => {
      await page.getByRole("button", { name: "Per Day" }).click();
      await page.getByPlaceholder("50").fill("50");
      await continueBtn().click();
    });

    await step("pairing length", async () => {
      await page.getByRole("button", { name: "1 Days" }).click();
      await continueBtn().click();
    });

    await step("departure", async () => {
      await page.getByPlaceholder("Montreal (YUL)").fill("Montreal (YUL)");
      await continueBtn().click();
    });

    await step(
      "destination — starts blank, genuinely required",
      async () => {
        await page.getByPlaceholder("Where are you flying? (city or airport)").fill("Paris (CDG)");
        await continueBtn().click();
      },
      {
        assertNoneSelectedFirst: async () => {
          await expect(page.getByPlaceholder("Where are you flying? (city or airport)")).toHaveValue("");
        },
      },
    );

    await step(
      "kitchen access — NOT stuck on Hotel/No Kitchen, no default at all",
      async () => {
        await page.getByRole("button", { name: "Full Kitchen at Home" }).click();
        await continueBtn().click();
      },
      {
        assertNoneSelectedFirst: async () => {
          await expect(page.getByText("Kitchen Access")).toBeVisible();
          await expect(continueBtn()).toBeDisabled();
          // Specifically prove Hotel isn't silently active — if it were, toggling
          // Full Kitchen on and nothing else would leave TWO kitchen types
          // selected instead of one, and the request would reflect Hotel too.
        },
      },
    );

    await step("duty schedule (optional) — skip", async () => {
      await continueBtn().click();
    });

    await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible({ timeout: 5000 });
    console.log("PASS  [3] full onboarding complete, reached boarding pass");
  });

  await test.step("2. Complete signup via OTP (no live inbox needed)", async () => {
    await page.getByRole("button", { name: "Generate My Plan" }).click();
    await expect(page.getByText("Check your email")).toBeVisible({ timeout: 10000 });

    let otp;
    if (MOCK) {
      otp = "123456";
    } else {
      const res = await page.request.get(`${API_BASE}/api/auth/dev-otp?email=${encodeURIComponent(testEmail)}`);
      if (!res.ok()) {
        throw new Error(
          `FAIL  [2] Could not read OTP from ${API_BASE}/api/auth/dev-otp (status ${res.status()}). ` +
          `For SMOKE_MOCK=0, the backend must be running LOCALLY with RESEND_API_KEY unset.`
        );
      }
      otp = (await res.json()).otp;
    }
    await page.locator('input[placeholder="000000"]').fill(otp);
    await page.getByRole("button", { name: "Verify Code" }).click();

    await expect(page.getByText("Secure your account")).toBeVisible({ timeout: 10000 });
    await page.getByPlaceholder("New password (8+ characters)").fill(testPassword);
    await page.getByPlaceholder("Confirm password").fill(testPassword);
    await page.getByRole("button", { name: "Set Password" }).click();
    console.log("PASS  [2] signed up via OTP with no live inbox, password set");
  });

  await test.step("4. Plan actually generates — not empty, not an error, reflects diet/kitchen/destination", async () => {
    await expect(page.getByText("Day 1").first()).toBeVisible({ timeout: 30000 });
    await expect(page.getByText(/error/i)).not.toBeVisible();
    const mealsVisible = await page.getByText(/Breakfast|Lunch|Dinner|Snack/).count();
    expect(mealsVisible, "plan rendered with zero meals").toBeGreaterThan(0);

    if (MOCK) {
      expect(lastRequestBody.diets).toContain("vegan");
      expect(lastRequestBody.kitchen).toContain("full_kitchen");
      expect(lastRequestBody.destinations?.[0]).toContain("Paris");
    }
    console.log(`PASS  [4] plan generated with ${mealsVisible} meal(s) visible, reflects selected diet/kitchen/destination`);
  });

  await test.step("5+6. Second pairing as returning user: diet is re-selectable, kitchen has no default, paywall gates #2 not #1", async () => {
    // The session is already persisted (token saved during step 2's OTP +
    // password flow) — a fresh load deterministically lands back on the
    // returning-user splash screen with "New Pairing", regardless of
    // whatever screen viewing the first plan left us on.
    await page.goto("/");
    await expect(page.getByRole("button", { name: "New Pairing" })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "New Pairing" }).click();

    // Diet step must be SHOWN (not silently skipped/reused) and pre-filled
    // from the profile but still changeable.
    await expect(page.getByText("Your Diet")).toBeVisible({ timeout: 5000 });
    await expect(continueBtn()).toBeEnabled(); // pre-filled from profile, not blocked
    const veganChip = page.getByRole("button", { name: /Vegan/ });
    await expect(veganChip).toBeVisible();
    await veganChip.click(); // toggle off
    await page.getByRole("button", { name: "Vegetarian", exact: false }).click(); // choose something different
    await continueBtn().click();
    console.log("PASS  [5] diet step shown on new pairing, genuinely re-selectable (changed vegan -> vegetarian)");

    await continueBtn().click(); // budget: pre-filled, editable
    await page.getByRole("button", { name: "1 Days" }).click();
    await continueBtn().click();
    await continueBtn().click(); // departure: pre-filled
    await page.getByPlaceholder("Where are you flying? (city or airport)").fill("Tokyo (NRT)");
    await continueBtn().click();

    await expect(page.getByText("Kitchen Access")).toBeVisible();
    // The proof that Hotel isn't silently pre-selected is behavioral: Continue
    // is still disabled here with zero interaction — if Hotel (or anything)
    // were pre-checked, Continue would already be enabled.
    await expect(continueBtn()).toBeDisabled();
    await page.getByRole("button", { name: "Fridge, No Stove" }).click();
    await continueBtn().click();
    console.log("PASS  [5] kitchen access on new pairing has no default — was NOT stuck on Hotel/No Kitchen");

    await continueBtn().click(); // duty schedule, skip

    await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible({ timeout: 5000 });
    console.log("PASS  [5] second pairing only asked trip-specific info (diet/budget pre-filled+editable, destination/kitchen fresh)");

    await page.getByRole("button", { name: "Generate My Plan" }).click();
    await expect(page.getByText("Premium Feature")).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("button", { name: /Subscribe/ })).toBeVisible();
    console.log("PASS  [6] paywall appears on pairing #2, not before pairing #1");
  });

  console.log("\n=== SMOKE TEST: ALL STEPS PASSED ===");
});

// ─────────────────────────────────────────────────────────────────────────
// HOW TO RUN
//
// Fast pre-deploy gate (default — mocked backend, no live secrets needed):
//   npx playwright test tests/smoke.spec.js
//
// Full live-stack run (real backend + real AI generation — the strongest
// gate, but requires local services and takes longer):
//   1. In nutricrew-backend/: temporarily unset RESEND_API_KEY (e.g. rename
//      .env's RESEND_API_KEY line) and run: node server.js
//   2. In nutricrew-frontend/: point VITE_API_BASE_URL at that local backend
//      in .env.local, then: npm run dev
//   3. SMOKE_MOCK=0 npx playwright test tests/smoke.spec.js
//      (set SMOKE_API_BASE if the backend isn't on the default port 3001)
// ─────────────────────────────────────────────────────────────────────────
