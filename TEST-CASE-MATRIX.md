# Test Case Matrix

Environment: `https://qakaio.github.io/rampz-store/`  
Reference execution: 37 cases in Chromium, Firefox, and WebKit (111 total runs).

## Automated cases

| ID | Priority | Scenario | Spec | Status |
|---|---|---|---|---|
| DEP-01 | P1 | Published page responds 200 as Rampz Store HTML | `e2e/deployment-smoke.spec.js` | Automated |
| DEP-02 | P1 | Published CSS and JavaScript respond 200 with expected MIME type | `e2e/deployment-smoke.spec.js` | Automated |
| UI-01 | P1 | No horizontal overflow across viewports from 320 to 1440 px | `e2e/accessibility-responsive.spec.js` | Automated |
| UI-02 | P1 | `/` shortcut focuses the search field | `e2e/accessibility-responsive.spec.js` | Automated |
| UI-03 | P2 | Main controls have accessible names and there is an H1 | `e2e/accessibility-responsive.spec.js` | Automated |
| UI-04 | P2 | Initial page load does not throw JavaScript exceptions | `e2e/accessibility-responsive.spec.js` | Automated |
| UI-05 | P1 | Axe validates WCAG 2.1 A/AA criteria on the home page | `e2e/accessibility-responsive.spec.js` | Expected failure — known violations |
| UI-06 | P1 | Axe validates WCAG 2.1 A/AA in the product detail dialog | `e2e/accessibility-responsive.spec.js` | Automated |
| UI-07 | P1 | Axe validates WCAG 2.1 A/AA in the registration form | `e2e/accessibility-responsive.spec.js` | Automated |
| CAT-01 | P1 | Catalog shows products, category, and pagination from seed data | `e2e/catalog.spec.js` | Automated |
| CAT-01b | P1 | Out-of-stock product does not offer a buy action | `e2e/catalog.spec.js` | Automated |
| CAT-02 | P1 | Search ignores case and allows clearing empty-state results | `e2e/catalog.spec.js` | Automated |
| CAT-03 | P1 | Category, price, stock, and sorting are combined correctly | `e2e/catalog.spec.js` | Automated |
| CAT-04 | P1 | Clear filters restores catalog and default values | `e2e/catalog.spec.js` | Automated |
| CAT-05 | P2 | Minimum equal to maximum price returns the matching product | `e2e/catalog.spec.js` | Automated |
| CAT-06 | P2 | Pagination advances and returns without duplicating products | `e2e/catalog.spec.js` | Automated |
| CAT-08a | P2 | Product dialog closes with Escape and restores focus | `e2e/catalog.spec.js` | Automated |
| CAT-08b | P2 | Product dialog closes via button | `e2e/catalog.spec.js` | Automated |
| CART-01 | P1 | Repeated additions consolidate quantity and update subtotal | `e2e/cart.spec.js` | Automated |
| CART-01b | P1 | Adds a product to the cart from the product detail dialog | `e2e/catalog.spec.js` | Automated |
| CART-02 | P1 | Cart quantity never exceeds 10 | `e2e/cart.spec.js` | Automated |
| CART-03 | P1 | Items and quantities persist after reload | `e2e/cart.spec.js` | Automated |
| CART-04a | P1 | Removing the last product shows empty state | `e2e/cart.spec.js` | Automated |
| CART-04b | P1 | Removing an item updates subtotal; removing the rest empties the cart | `e2e/cart.spec.js` | Automated |
| CART-05 | P2 | Corrupted cart storage does not prevent opening the cart | `e2e/cart.spec.js` | Automated |
| CART-06 | P2 | Maximum quantity respects available stock | `e2e/cart.spec.js` | Automated |
| CHK-01 | P1 | Empty cart checkout should be unavailable | `e2e/checkout.spec.js` | Automated — known expected failure |
| CHK-02a | P1 | Empty address does not advance checkout | `e2e/checkout.spec.js` | Automated |
| CHK-02b | P1 | Invalid email and ZIP do not advance checkout | `e2e/checkout.spec.js` | Automated |
| CHK-10 | P1 | Public shipping failure shows an error and does not confirm the order | `e2e/checkout.spec.js` | Automated |
| ACC-05 | P1 | Empty required fields block account registration | `e2e/account.spec.js` | Automated |
| ACC-05b | P1 | Invalid CPF shows an error and does not save the account | `e2e/account.spec.js` | Automated |
| ACC-06 | P1 | Different passwords do not create an account | `e2e/account.spec.js` | Automated |
| CON-01a | P1 | Empty required contact fields block submission | `e2e/contact.spec.js` | Automated |
| CON-01b | P1 | Invalid email and message length are rejected | `e2e/contact.spec.js` | Automated |
| CON-02 | P1 | Valid contact form shows local confirmation without submission request | `e2e/contact.spec.js` | Automated |
| NAV-01 | P2 | Category, story, and contact anchors navigate correctly | `e2e/accessibility-responsive.spec.js` | Automated |

## Known issue

`CHK-01`: the published app keeps the **Continue to checkout** button enabled even with an empty cart. The test uses `test.fail` to record the expected defect without making the suite unstable. Remove that annotation when the behavior is fixed so the regression becomes an unexpected CI failure again.

## Environment limits and backlog

| Area | Status | Reason / next step |
|---|---|---|
| Catalog, shipping, and coupon API | Pending | GitHub Pages does not publish the Node.js API; run against a backend environment when available |
| Payment, orders, and coupon rules | Pending | Require API and isolated/resettable test data |
| Authenticated login, order history, logout | Pending | Requires auth service in the tested environment |
| Admin and order transitions | Pending | Requires API and seeded admin data |
| CAT-05b, invalid or inverted price limits | Pending | Define expected behavior before locking the assertions |
| CART-06b, stock changes between catalog and checkout | Pending | Requires concurrent backend stock updates |
| Manual accessibility review | Pending | Complement automated `axe` audits with keyboard and screen reader validation |
| Cross-browser support | Automated | 37 cases run in Chromium, Firefox, and WebKit in CI |

## Accessibility baseline

In the reference execution, `axe-core` found 88 affected nodes on the home page due to two high-severity rules: insufficient color contrast (`color-contrast`, 73 nodes) and visible text that does not match accessible names (`label-content-name-mismatch`, 15 nodes). Because this repository contains only tests and the site is published in another repository, `UI-05` remains marked as an expected failure to preserve the detail in the report without failing CI. The interactive states covered by `UI-06` and `UI-07` pass the automated audit; this does not replace manual validation.

The smoke tests `DEP-*` validate static delivery (HTML/CSS/JavaScript) over HTTP; they should not be counted as coverage for business API endpoints.
