# QA Automation Guide — Rampz Store

This guide explains how the Rampz Store QA automation suite is structured as a portfolio project. The goal is to demonstrate test planning, UI automation, API awareness, validation of business rules, evidence collection, and quality control.

> Rampz Store is a fictional demo application for training. Registration, login, orders, payments, Pix, boleto, and administration are local demo flows. No real payments, emails, or orders are sent.
> Base URL: https://qakaio.github.io/rampz-store

## 1. What exists in the project

- Base URL: https://qakaio.github.io/rampz-store
- Frontend built with HTML, CSS, and JavaScript without a framework
- Local Node.js server with demo API for catalog, shipping, and coupons
- In-memory API data and browser experience data mostly stored in localStorage
- 20 seeded products; catalog shows 12 products per page
- Demo customer account: `cliente@rampz.test` / `Teste@1234`
- Demo admin account: `admin@rampz.test` / `Admin@1234`
- Locked and inactive accounts available for login rules: `bloqueado@rampz.test` and `inativo@rampz.test` (use the default wrong password `WrongPassword@1` to validate the generic message)
- Product 12 is out of stock; product 11 is a high-value item for card scenarios
- Demo coupons: `LAB20`, `FRETEGRATIS`, `BEMVINDO10`, and an expired coupon (`EXPIRADO`)

Use demo credentials only. Do not use personal passwords. The admin panel is local-only and should not be considered a secure production system.

The public URL used in this project is served by GitHub Pages. The interface and catalog load correctly, but the Node.js API described above is not published there. Shipping and other flows that depend on the backend cannot be validated as happy-path scenarios on that URL.

## 2. Setup and commands

Requirements: Node.js 20 or newer. From the project folder in PowerShell:

```powershell
npm ci
npx playwright install chromium
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
npx playwright test e2e/cart.spec.js --project=chromium
npx playwright test --grep "CART"
npx playwright test --repeat-each=2
npm run allure:generate
```

By default, the suite targets the published version at `https://qakaio.github.io/rampz-store/`; it does not start a local server or reset the remote environment. To target a different environment, set `PLAYWRIGHT_BASE_URL` before running tests.

Playwright, Allure, and trace artifacts are saved in `playwright-report/`, `allure-report/`, `allure-results/`, and `test-results/`. Generating the Allure HTML report requires Java 17 or newer. To open reports after execution:

```powershell
npm run test:e2e:report
npm run allure:open
```

The workflow in `.github/workflows/e2e.yml` runs Chromium, Firefox, and WebKit on pull requests, pushes, manual runs, and weekly schedule. Reports and artifacts are published for 14 days, and Java 17 is installed in CI to generate the Allure HTML report.

## 3. Test strategy

Organize the suite by level instead of trying to prove everything through the browser:

1. Unit/rule tests: exact coupon and shipping limits, invalid inputs, and calculation logic without starting a browser server.
2. API tests: HTTP status, JSON format, validations, seed data, headers, request limits, and invalid routes. These are not executed against the public site because the demo API is not available on GitHub Pages.
3. E2E tests: end-to-end user journeys and visible outcomes run against the published URL. Specs are organized by catalog, cart, checkout, contact, and UI checks under `e2e/`.
4. Deployment smoke checks: check the HTTP status and content type for the published HTML, CSS, and JavaScript. These verifies static hosting, not business API contracts.
5. CI tooling tests: unit tests for the result aggregator that correctly classifies passes, expected failures, unexpected passes, and retries.
6. Lightweight non-functional checks: responsiveness, keyboard use, overflow absence, and automated `axe-core` audits for WCAG 2.1 A/AA. These are cross-browser checks and not a replacement for manual validation or screen-reader testing.

A good suite does not duplicate the same rule at every level. For example, validating many shipping combinations is faster in a rules/API test; in the browser, validate the user journey and the final result presented to the user.

## 4. E2E coverage implemented

The cases below are automated in `e2e/*.spec.js` and execute against the published version. The suite was expanded with backlog scenarios and covers only behaviors that can be validated on the published app.

| Area | Existing scenarios |
|---|---|
| Catalog | Visual seed and pagination, case-insensitive search, empty-state and clear-state behavior, category + price + stock + sorting combinations, exact price filter, product detail close via Escape or button, out-of-stock product |
| Cart | Add from detail dialog and repeat add, subtotal, quantity change, max limit, stock limit, remove one/all items, persistence after reload, corrupted localStorage recovery |
| Checkout | Item opened; required address validation, invalid email and zip, failed public shipping API without improper confirmation |
| Account | Required field validation, invalid CPF without saving, mismatched password confirmation |
| Contact | Required fields, email format, message length validation, local confirmation without request submission |
| Layout, keyboard, and accessibility | Viewports 320, 390, 768, 1280, and 1440; `/` shortcut; anchor navigation; accessible names on primary controls; basic heading hierarchy; JavaScript exceptions; `axe-core` audits for WCAG 2.1 A/AA on the home page, product dialog, and registration form |
| Deployment | HTTP 200 response and correct MIME type for the published HTML, CSS, and JavaScript. Does not validate business API endpoints |

The tests `CHK-01` and `CART-04` validate and document the empty checkout state. `CHK-01` is marked as an expected failure because the public app leaves the checkout button enabled with an empty cart, which is not the desired behavior. If that behavior is fixed in the site, remove the `test.fail` annotation so the regression becomes an unexpected CI failure again.

## 5. Backlog for test coverage expansion

Use the scenarios below as additional backlog items. Remove cases already covered in the matrix above as the suite evolves. Do not mark a case as automated without a real test and execution evidence.

### 5.1 Catalog and navigation

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| CAT-01 | P1 | Validate category and product API response | HTTP/JSON contract validated against an environment exposing the API |
| CAT-05b | P2 | Min price greater than max price or negative price | Document expected business rule before automating |
| CAT-07 | P1 | Category or product API unavailable/invalid | Clear error message; do not show success with stale data |
| CAT-09 | P2 | Validate brand link and uncovered anchors/links | Navigation/scroll lands on the correct section |

### 5.2 Cart

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| CART-06b | P2 | Stock changes between catalog and checkout | User receives a clear error and cannot confirm an unavailable quantity |
| CART-07 | P2 | Login/logout with cart already filled | Confirm intentional merge or replacement behavior between guest and account cart |

### 5.3 Checkout, shipping, and coupons

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| CHK-03 | P1 | Calculate shipping for ZIP codes in different regions | Region, ETA, and price match simulated rules |
| CHK-04 | P1 | Free shipping at exact threshold and above | Confirm boundary behavior (`R$ 500` and `R$ 500.01`) |
| CHK-05 | P1 | Apply `LAB20` below and above minimum | Below threshold rejected; above threshold applies eligible discount |
| CHK-06 | P1 | Apply `FRETEGRATIS` below and above minimum | Benefit appears only when eligible |
| CHK-07 | P1 | `BEMVINDO10` for first purchase and returning paid customer | Eligibility considers previous paid order from same email, not pending or different customer |
| CHK-08 | P2 | Unknown, expired, spaced, and case-different coupon | Normalization/error behavior is consistent and understandable |
| CHK-09 | P1 | Change coupon or address after shipping calculation | Total and shipping option recalculate; do not reuse stale quote |
| CHK-11 | P1 | Return between steps and change quantity/data | Summary reflects latest values and does not duplicate discount/shipping |
| CHK-12 | P1 | Confirm order after review | Order number, items, amount, and status are consistent with the journey |

### 5.4 Demo payments and orders

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| PAY-01 | P1 | Approved demo card | Order marked as paid; message clarifies no charge was made |
| PAY-02 | P1 | Rejected demo card or timeout | No confirmed order, no charge, cart preserved; error allows retry |
| PAY-03 | P1 | Total below minimum installment | Card cannot proceed; alternative method remains available |
| PAY-04 | P1 | Pix | Demo discount and QR code are clearly identified as fictional; documented expected status |
| PAY-05 | P1 | Boleto | Code is labeled fictional and order remains pending |
| PAY-06 | P1 | Double click or two rapid confirmations | No duplicate order or inconsistent state |
| PAY-07 | P2 | Refresh or return from confirmation screen | No duplicate order creation; confirmation remains coherent |
| ORD-01 | P1 | Customer views paid and pending orders | Only relevant orders are displayed with the correct status |
| ORD-02 | P1 | Cancel pending order | Status updates to canceled and action is no longer available |
| ORD-03 | P1 | Try canceling a paid or canceled order | Action is blocked according to state transition rules |
| ORD-04 | P1 | Admin updates a pending order | Allowed status is saved and rendered; invalid transitions also covered |
| ORD-05 | P2 | Order from another account | Does not appear in another customer history |

### 5.5 Account, admin, and contact

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| ACC-01 | P1 | Valid client/admin login | Opens the correct role panel |
| ACC-02 | P1 | Unknown email and wrong password for existing account | Same generic message; no account existence leak |
| ACC-03 | P1 | Blocked/inactive account | Login does not create a session; message is clear without exposing unnecessary data |
| ACC-04 | P2 | Login attempts limit and temporary lockout | After limit, behavior and recovery time follow implementation rule |
| ACC-05 | P1 | Registration with invalid email, invalid CPF, or duplicate email | Validation blocks registration and gives field/form feedback |
| ACC-06 | P1 | Weak password or mismatched confirmation | No account is created |
| ACC-07 | P1 | Recovery with invalid email/token or already-used token | Password is not changed; feedback does not confirm account existence |
| ACC-08 | P2 | Session persistence after reload, expiration, and logout | Persistence/expiration follows documented demo behavior |
| ADM-01 | P1 | Create/edit/delete product | Local changes reflect in the list and persist in the browser as expected |
| ADM-02 | P1 | Save invalid product name/price/stock | Form rejects invalid data and shows the issue |
| ADM-03 | P2 | Edit image/optional fields and cancel | No data corruption or unintended changes |
| ADM-04 | P1 | Client user tries to access admin controls | Controls do not appear or remain inaccessible |
| ADM-05 | P1 | Change order status to an invalid transition | Operation is blocked or error is shown; previous state remains |

### 5.6 API and non-functional checks

| ID | Priority | Scenario | Expected result |
|---|---|---|---|
| API-01 | P1 | Catalog: search, pagination, category, price, stock, and sorting | Status, format, total count, and items match requested parameters |
| API-02 | P1 | Nonexistent product and nonexistent endpoint | 404 with appropriate format (JSON API vs public page) |
| API-03 | P1 | Invalid shipping ZIP payload and subtotal outside limit | Documented client error; no successful quote returned |
| API-04 | P1 | Eligible, ineligible, expired, unknown, and malformed coupons | Status and body are consistent with rule engine |

## 6. Known limitations

The repository contains test automation only, not the application code itself. The public GitHub Pages URL provides the interface but not the Node.js backend described above. Because of that, any contract tests for catalog, shipping, coupons, payments, orders, authentication, and administration need an application environment with the backend available to be covered as positive journeys.
