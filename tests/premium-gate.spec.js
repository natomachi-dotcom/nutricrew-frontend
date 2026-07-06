import { test, expect } from "@playwright/test";
import { gotoFresh, completeCheckIn } from "./fixtures.js";

test("hitting the free pairing limit shows the premium upgrade screen", async ({ page }) => {
  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({
      status: 403,
      json: {
        error: "premium_required",
        message: "You've used all 3 free pairing plans. Upgrade to Premium for unlimited plans.",
        pairingCount: 3,
      },
    });
  });

  await gotoFresh(page);
  await completeCheckIn(page);
  await page.getByRole("button", { name: "Generate My Plan" }).click();

  await expect(page.getByText("Premium Feature")).toBeVisible();
  await expect(page.getByText("Start Your Free Month")).toBeVisible();

  // The free-pairing usage reported by the server is persisted locally.
  await expect.poll(() => page.evaluate(() => localStorage.getItem("nutricrew_pairing_count"))).toBe("3");

  // Back returns to the boarding pass screen.
  await page.getByRole("button", { name: "← Back" }).click();
  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
});
