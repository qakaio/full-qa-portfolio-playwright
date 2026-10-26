import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openCleanStore } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await openCleanStore(page);
});

test("UI-01 P1 - não apresenta overflow horizontal nos viewports alvo", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));

    expect(
      dimensions.content,
      `overflow horizontal no viewport de ${width}px`,
    ).toBeLessThanOrEqual(dimensions.viewport);
  }
});

test("UI-02 P1 - atalho de teclado foca a busca", async ({ page }) => {
  const search = page.getByRole("searchbox", { name: /Search products/ });

  await page.keyboard.press("/");
  await expect(search).toBeFocused();
});

test("UI-03 P2 - controles principais têm nomes acessíveis", async ({
  page,
}) => {
  await expect(
    page.getByRole("searchbox", { name: /Search products/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open account" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open shopping bag" }),
  ).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByLabel("Subject")).toBeVisible();
  await expect(page.getByLabel("Your message")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});

test("NAV-01 P2 - links da navegação levam às seções correspondentes", async ({
  page,
}) => {
  await page.getByTestId("nav-categories").click();
  await expect(page).toHaveURL(/#categories$/);

  await page.getByTestId("nav-our-story").click();
  await expect(page).toHaveURL(/#about$/);

  await page.getByTestId("nav-contact").click();
  await expect(page).toHaveURL(/#contact$/);
});

test("UI-04 P2 - página inicial não lança exceções JavaScript", async ({
  page,
}) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.reload();
  await expect(page.getByTestId("product-card-1")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("UI-05 P1 - página inicial não apresenta violações WCAG A/AA", async ({
  page,
}) => {
  test.fail(
    true,
    "Baseline público registra violações conhecidas; remover após correção no site.",
  );

  const accessibilityScan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const violations = accessibilityScan.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    affectedNodes: violation.nodes.length,
    sampleTargets: violation.nodes.slice(0, 3).map((node) => node.target),
  }));

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("UI-06 P1 - diálogo de produto atende WCAG 2.1 A/AA", async ({
  page,
}) => {
  await page.getByTestId("product-detail-3").click();
  const dialog = page.getByRole("dialog", { name: "Glass Beaker 250ml" });
  await expect(dialog).toBeVisible();

  const accessibilityScan = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const violations = accessibilityScan.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    affectedNodes: violation.nodes.length,
    sampleTargets: violation.nodes.slice(0, 3).map((node) => node.target),
  }));

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});

test("UI-07 P1 - formulário de cadastro atende WCAG 2.1 A/AA", async ({
  page,
}) => {
  await page.getByTestId("open-account-button").click();
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.getByTestId("register-submit-button")).toBeVisible();

  const accessibilityScan = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const violations = accessibilityScan.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    affectedNodes: violation.nodes.length,
    sampleTargets: violation.nodes.slice(0, 3).map((node) => node.target),
  }));

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
});
