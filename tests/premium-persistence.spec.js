import { test, expect } from "@playwright/test";

// Regression: a user who reaches the paywall on their VERY FIRST pairing
// attempt has never been through OTP verification, so they have no session
// token yet. Previously, returning from Stripe checkout only set isPremium
// via a one-shot ?premium=true URL flag plus a verify-session poll that
// silently no-ops without a token — nothing durable ever got saved. Any
// reload after the initial redirect lost premium status entirely and sent
// the user back to the paywall despite having already paid. Production
// report: subscribers stuck in a loop back to checkout after paying.
test("premium status survives a reload even with no session token", async ({ page }) => {
  // Simulate a brand-new user who's already typed their info into the
  // check-in form (so USER_KEY has an email) but never completed a
  // successful generation — so no session token exists yet. This is the
  // exact account state a first-attempt paywall hit leaves behind. Seeded
  // via evaluate (not addInitScript, which re-fires on every navigation
  // and would wipe the fix's result on the reload checked below) between
  // two same-origin navigations, so it persists in localStorage exactly
  // like a real prior session would.
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.setItem("nutricrew_user", JSON.stringify({
      email: "newuser-premium-test@example.com",
      name: "New User",
      needsPremium: true,
    }));
  });

  // Land back from a successful Stripe checkout redirect.
  await page.goto("/?premium=true");

  // The persistence happens in a useEffect keyed on the one-shot
  // premiumSuccess flag — it commits shortly after mount, not necessarily
  // by the time "load" fires, so poll rather than reading localStorage
  // exactly once (a single immediate read is a race under load, not a
  // real product bug).
  await expect(async () => {
    const user = await page.evaluate(() => {
      const raw = localStorage.getItem("nutricrew_user");
      return raw ? JSON.parse(raw) : null;
    });
    expect(user?.isPremium).toBe(true);
    expect(user?.needsPremium).toBe(false);
  }).toPass({ timeout: 10000 });

  // Still no session token — this account genuinely has none yet.
  expect(await page.evaluate(() => localStorage.getItem("nutricrew_session"))).toBeNull();

  // Reload as a fresh page load, WITHOUT ?premium=true (it's stripped from
  // the URL immediately after the first read, so this matches exactly what
  // happens on any real subsequent visit — tab reopened, PWA resumed, etc.).
  await page.goto("/");

  await expect(async () => {
    const user = await page.evaluate(() => {
      const raw = localStorage.getItem("nutricrew_user");
      return raw ? JSON.parse(raw) : null;
    });
    expect(user?.isPremium).toBe(true);
    expect(user?.needsPremium).toBe(false);
  }).toPass({ timeout: 10000 });
});
