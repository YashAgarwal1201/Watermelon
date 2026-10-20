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
    await expect(page.getByRole("link", { name: "Apps", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Insights" })).toBeVisible();
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
    await expect(
      page.getByRole("listitem", { name: "Open Vite Iframe Asset Manager" })
    ).toBeVisible();
    await expect(
      page.getByRole("listitem", { name: "Open Next.js Iframe Analytics" })
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
    {
      id: "wc_lit_remoteapp",
      name: "Lit 3 Remote (Web Component)",
    },
    {
      id: "wc_vue_remoteapp",
      name: "Vue 3 Custom Element Remote (Web Component)",
    },
    {
      id: "iframe_vite_app",
      name: "Vite + React 19 Iframe Remote",
    },
    {
      id: "iframe_nextjs_app",
      name: "Next.js 16 App Router Iframe Remote",
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

  test("4. Iframe Remote: Asset Manager loads inside iframe and isolates errors", async ({ page }) => {
    await page.goto("/remote/iframe_vite_app", { waitUntil: "networkidle" });

    // Host heading should still be visible
    await expect(page.locator(".remote-wrapper h1").first()).toBeVisible();

    // Find the iframe inside the shadow root of .remote-container
    const iframeElement = page.locator(".remote-container iframe");
    await expect(iframeElement).toBeVisible();

    // Access frame content
    const frame = page.frameLocator(".remote-container iframe");

    // Asset Manager title should be visible inside iframe
    await expect(frame.getByRole("heading", { name: "Asset / Media Manager" })).toBeVisible();

    // Open asset details (internal client routing demonstration)
    const heroAsset = frame.getByText("hero-banner-v2.webp").first();
    await expect(heroAsset).toBeVisible();
    await heroAsset.click();

    // Verify internal detail route is rendered
    await expect(frame.getByText("Internal Route:")).toBeVisible();

    // Click "Select This Asset for Host" to emit bridge message
    const selectBtn = frame.getByRole("button", { name: /Select This Asset for Host/i });
    await expect(selectBtn).toBeVisible();
    await selectBtn.click();

    // Verify bridge event banner is rendered
    await expect(frame.getByText("Bridge PostMessage Emitted:")).toBeVisible();
    await expect(frame.locator(".event-banner code")).toContainText("hero-banner-v2.webp");

    // Navigate back to grid
    const backBtn = frame.getByRole("button", { name: /Back to Asset Grid/i });
    await expect(backBtn).toBeVisible();
    await backBtn.click();

    // Test crash isolation inside iframe
    const crashBtn = frame.getByRole("button", { name: /Simulate Remote Crash/i });
    await expect(crashBtn).toBeVisible();
    await crashBtn.click();

    // Internal RemoteErrorBoundary should catch the error without breaking host
    await expect(frame.getByText("Simulated Remote Exception Caught")).toBeVisible();
    await expect(page.locator(".remote-wrapper h1").first()).toBeVisible();

    // Recover from error
    const recoverBtn = frame.getByRole("button", { name: /Recover Remote/i });
    await expect(recoverBtn).toBeVisible();
    await recoverBtn.click();

    // Asset manager heading returns
    await expect(frame.getByRole("heading", { name: "Asset / Media Manager" })).toBeVisible();
  });

  test("5. Iframe Remote: Next.js Analytics Dashboard loads inside iframe and isolates errors", async ({ page }) => {
    await page.goto("/remote/iframe_nextjs_app", { waitUntil: "networkidle" });

    // Host heading should still be visible
    await expect(page.locator(".remote-wrapper h1").first()).toBeVisible();

    // Find the iframe inside the shadow root of .remote-container
    const iframeElement = page.locator(".remote-container iframe");
    await expect(iframeElement).toBeVisible();

    // Access frame content
    const frame = page.frameLocator(".remote-container iframe");

    // Dashboard heading should be visible inside iframe
    await expect(frame.getByRole("heading", { name: "Analytics & Telemetry Dashboard" })).toBeVisible();

    // Click 30D time range selector
    const range30d = frame.getByRole("button", { name: "30D" });
    await expect(range30d).toBeVisible();
    await range30d.click();

    // Verify bridge event banner is rendered
    await expect(frame.getByText("Bridge PostMessage Emitted:")).toBeVisible();
    await expect(frame.locator(".event-banner code")).toContainText('ANALYTICS_FILTER_CHANGED: range="30d"');

    // Test crash isolation inside iframe
    const crashBtn = frame.getByRole("button", { name: /Simulate Remote Crash/i });
    await expect(crashBtn).toBeVisible();
    await crashBtn.click();

    // Internal RemoteErrorBoundary should catch the error without breaking host
    await expect(frame.getByText("Simulated Remote Exception Caught")).toBeVisible();
    await expect(page.locator(".remote-wrapper h1").first()).toBeVisible();

    // Recover from error
    const recoverBtn = frame.getByRole("button", { name: /Recover Remote/i });
    await expect(recoverBtn).toBeVisible();
    await recoverBtn.click();

    // Dashboard heading returns
    await expect(frame.getByRole("heading", { name: "Analytics & Telemetry Dashboard" })).toBeVisible();
  });

  test("16. Architecture & Insights page loads successfully with 3-paradigm matrix and engineering findings", async ({ page }) => {
    await page.goto("/architecture");

    // Main heading
    await expect(
      page.getByRole("heading", { name: "Microfrontend Architecture & Insights", level: 1 })
    ).toBeVisible();

    // Section 1 heading & comparison table
    await expect(
      page.getByRole("heading", { name: "1. The 3-Paradigm Comparison Matrix", level: 2 })
    ).toBeVisible();
    await expect(page.getByText("Detailed Feature & Trade-off Matrix")).toBeVisible();

    // Section 2 heading
    await expect(
      page.getByRole("heading", { name: "2. Runtime Lifecycle Mechanics", level: 2 })
    ).toBeVisible();

    // Section 3 heading & engineering finding
    await expect(
      page.getByRole("heading", { name: "3. Real-World Engineering Findings & Benchmarks", level: 2 })
    ).toBeVisible();
    await expect(page.getByText("Shadow DOM Portal Leaks with UI Libraries")).toBeVisible();
    await expect(page.getByText("Monorepo RAM Explosion vs Unified Static Serving")).toBeVisible();

    // Section 4 Architecture Q&A
    await expect(
      page.getByRole("heading", { name: "4. Architecture Q&A & FAQ", level: 2 })
    ).toBeVisible();

    // Verify in-page pill buttons scroll without modifying URL hash or polluting browser history
    const findingsPill = page.locator('[data-nav-section="findings"]');
    await expect(findingsPill).toBeVisible();
    await findingsPill.click();

    // URL must not contain any '#' hash
    expect(page.url()).toBe("https://localhost:5150/architecture");

    // Verify clean browser Back/Forward navigation
    await page.goto("/");
    await page.goto("/architecture");
    const faqPill = page.locator('[data-nav-section="faq"]');
    await expect(faqPill).toBeVisible();
    await faqPill.click();
    expect(page.url()).toBe("https://localhost:5150/architecture");

    // Going back should directly return to home page without getting trapped by in-page pill clicks
    await page.goBack();
    expect(page.url()).toBe("https://localhost:5150/");

    // Going forward returns to architecture
    await page.goForward();
    expect(page.url()).toBe("https://localhost:5150/architecture");
  });
});
