# QA Automation Portfolio — Rampz Store

![Playwright CI](https://github.com/qakaio/full-qa-portfolio-playwright/actions/workflows/e2e.yml/badge.svg)

Playwright E2E portfolio project for a demo storefront.

**Live demo:** https://qakaio.github.io/rampz-store/

**Allure report:** https://qakaio.github.io/full-qa-portfolio-playwright/

## Coverage

- 37 scenarios across Chromium, Firefox, and WebKit (111 browser runs)
- Catalog, cart, checkout validation, account, and contact flows
- Responsive layout, keyboard navigation, and axe-core accessibility checks
- Static deployment smoke checks and GitHub Actions CI

Known expected failures are documented in the [test case matrix](./TEST-CASE-MATRIX.md).

## Quality approach

- Reset browser storage before each scenario to reduce cross-test state leakage
- Use user-facing roles/labels and stable test IDs for clear, maintainable selectors
- Cover negative paths and boundaries, including empty states, stock limits, and exact price ranges
- Track known product defects as expected failures instead of masking them

## Run locally

```bash
npm ci
npx playwright install chromium firefox webkit
npm run test:all
```

To generate the Allure report locally, install Java 17+ and run:

```bash
npm run allure:generate
npm run allure:open
```

## Scope and limitations

The tests target the public static site. API contracts and positive flows for authentication, payments, orders, and administration require a backend environment and are not currently covered.

## Documentation

- [QA Automation Guide](./QA-AUTOMATION-GUIDE.md)
- [Test Case Matrix](./TEST-CASE-MATRIX.md)

## Author

**Kaio Garcia** | QA Engineer

[GitHub](https://github.com/qakaio) · [LinkedIn](https://www.linkedin.com/in/kaioqa/)
