import { test, expect } from "@playwright/test";

test.describe("Watermelon Microfrontend Federation", () => {
  test("1. Host shell loads home page successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Host App/i);

    // Host heading should be visible
    await expect(
      page.getByRole("heading", { name: "Watermelon", level: 1 })
    ).toBeVisible();

    // Home navigation links should be visible
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Apps" })).toBeVisible();
  });

  test("2. Remote list displays all remotes", async ({ page }) => {
    await page.goto("/remote");

    await expect(
      page.getByRole("heading", { name: "Remote Apps", level: 1 })
    ).toBeVisible();
    await expect(page.getByText("Vite", { exact: true })).toBeVisible();
    await expect(page.getByText("Webpack", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("listitem", { name: "Open Angular Remote" })
    ).toBeVisible();
  });

  const remotes = [
    {
      id: "vite_react_remoteapp",
      name: "Vite + React 19 Remote",
    },
    {
      id: "vite_vue_remoteapp",
      name: "Vite + Vue 3 Remote",
    },
    {
      id: "vite_svelte_remoteapp",
      name: "Vite + Svelte 5 Remote",
    },
    {
      id: "vite_solidjs_remoteapp",
      name: "Vite + SolidJS Remote",
    },
    {
      id: "webpack_react_remoteapp",
      name: "Webpack 5 + React 19 Remote",
    },
    {
      id: "webpack_vue_remoteapp",
      name: "Webpack 5 + Vue 3 Remote",
    },
    {
      id: "angular_remoteapp",
      name: "Angular 20 Remote (Web Component)",
    },
  ];

  for (const remote of remotes) {
    test(`3. Remote mounts cleanly: ${remote.name}`, async ({ page }) => {
      await page.goto(`/remote/${remote.id}`, { waitUntil: "networkidle" });

      // Ensure no error boundary is triggered
      const errorBox = page.locator(".bg-red-100");
      await expect(errorBox).not.toBeVisible();

      // Ensure wrapper heading displays the remote name
      const wrapperHeading = page.locator(".remote-wrapper h1").first();
      await expect(wrapperHeading).toBeVisible();

      // Ensure the remote container exists and is visible
      const container = page.locator(".remote-container");
      await expect(container).toBeVisible();

      // Verify remote content has rendered inside the container (including shadow root)
      const childCount = await page.evaluate(() => {
        const el = document.querySelector(".remote-container");
        if (!el) return 0;
        return el.shadowRoot
          ? el.shadowRoot.childNodes.length
          : el.childNodes.length;
      });
      expect(childCount).toBeGreaterThan(0);
    });
  }
});
