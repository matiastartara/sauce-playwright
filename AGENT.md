# Project Agent - SauceDemo Playwright Automation

This project is a test automation suite for the [SauceDemo](https://www.saucedemo.com/) website using Playwright and TypeScript. It follows the official [Playwright best practices](https://playwright.dev/docs/best-practices) for scalability and maintainability, and covers both UI (E2E) and API testing.

## 🚀 Tech Stack

- **Framework:** [Playwright](https://playwright.dev/) `@playwright/test`
- **Language:** TypeScript
- **Pattern:** Page Object Model (POM) + custom fixtures
- **Schema validation:** [Zod](https://zod.dev/) (API response contracts)
- **Reporting:** HTML reporter + [Allure](https://allurereport.org/)
- **Linting/Formatting:** ESLint (`eslint-plugin-playwright`) + Prettier
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions

## 📁 Project Structure

```text
.
├── fixtures/
│   └── baseFixture.ts      # Custom fixtures, injects Page Objects into tests
├── pages/                  # Page Object Model classes
│   ├── BasePage.ts         # Shared/abstract page behavior
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── NavigationMenu.ts
├── tests/
│   ├── e2e/                 # UI specs (project: e2e-chromium)
│   │   ├── login.spec.ts
│   │   ├── checkout.spec.ts
│   │   └── navigation.spec.ts
│   └── api/                 # API specs (project: api)
│       └── api.spec.ts
├── data/                    # Static/test data and fixtures data
│   ├── loginData.ts
│   └── api/create-post.json
├── playwright.config.ts     # Playwright configuration (projects, reporters, baseURL)
├── Dockerfile
└── docker-compose.yml
```

## 🛠️ How to Work with Playwright in this Project

### 1. Page Object Model (POM)

All interaction logic with the UI must be encapsulated within classes in the `pages/` directory. Each page/component should represent a specific part of the application and extend `BasePage`.

- Use meaningful method names that describe **user intent**, not implementation (`submitLoginForm()`, not `clickButton()`).
- Expose locators as `readonly` class properties, defined once in the constructor — never re-query the DOM inline inside test files.
- Page objects should return data or trigger actions; they should **not** contain assertions. Keep `expect(...)` calls in the test/spec files, not inside page classes.
- Prefer composing small components (e.g. `NavigationMenu`) over one giant page class when a UI element (menu, header, modal) is shared across pages.
- Follow the official POM guide: https://playwright.dev/docs/pom

### 2. Fixtures

We use custom fixtures in `fixtures/baseFixture.ts` to simplify test setup and inject Page Objects directly into tests, instead of instantiating `new SomePage(page)` manually inside each test.

- **Usage in tests:**
  ```typescript
  import { test, expect } from '../../fixtures/baseFixture';

  test('login test', async ({ loginPage }) => {
    await loginPage.login('user', 'pass');
  });
  ```
- **Current state / known gap:** today only `loginPage` is registered in `baseFixture.ts`. `CartPage`, `InventoryPage`, `CheckoutPage`, and `NavigationMenu` are instantiated manually inside `checkout.spec.ts` and `navigation.spec.ts`. When touching these tests, prefer extending `baseFixture.ts` to register all page objects as fixtures for consistency — fixtures are auto-cleaned up per test and avoid duplicated instantiation boilerplate.
- Fixtures are the recommended way to share setup/teardown logic (e.g. authenticated state, seeded data) across tests. See: https://playwright.dev/docs/test-fixtures
- Always import `test`/`expect` from `../../fixtures/baseFixture`, not directly from `@playwright/test`, so fixtures stay available.

### 3. Locators & Selectors

Playwright locators are lazy and auto-retrying — always prefer them over manual `ElementHandle`/`querySelector` usage.

- **Priority order for choosing a locator** (per [official guidance](https://playwright.dev/docs/locators)):
  1. `page.getByRole()` — mirrors how users/assistive tech perceive the page (buttons, links, headings, checkboxes). Most resilient to DOM changes.
  2. `page.getByLabel()` / `page.getByPlaceholder()` — for form fields.
  3. `page.getByText()` — for non-interactive text content.
  4. `page.getByTestId()` — when the app exposes stable `data-testid`/`data-test` attributes and no accessible role/text is reliable.
  5. CSS/XPath (`page.locator('css=...')`) — **last resort**, only when none of the above apply.
- This project's app (SauceDemo) exposes stable `data-test="..."` attributes on most elements — current page objects use `page.locator('[data-test="..."]')`, which is acceptable here since it plays the same role as `getByTestId` and is stable across the app. When a `data-test` attribute is not present, prefer `getByRole`/`getByText` over inventing brittle CSS selectors.
- Avoid selectors coupled to visual structure or index-based CSS (`div > div:nth-child(3)`); prefer `.nth()` on a well-scoped locator when a specific item in a list is truly needed (as done in `CartPage`/`InventoryPage`).
- Keep locators as `readonly` properties on the page object — don't scatter raw selector strings across test files.
- Use [`page.getByTestId()`](https://playwright.dev/docs/locators#locate-by-test-id) instead of `page.locator('[data-test="..."]')` going forward if consistency with Playwright's built-in test-id API is preferred (configurable via `testIdAttribute` in `playwright.config.ts` since SauceDemo uses `data-test` instead of the default `data-testid`).

### 4. Waits & Auto-waiting

Playwright locators and web-first assertions auto-wait and auto-retry — **manual waits should almost never be needed**.

- ❌ Never use `page.waitForTimeout()` in committed code — it's a flaky, arbitrary sleep, only acceptable for local debugging.
- ❌ Don't manually poll with loops/`sleep`. Let `expect(locator).toBeVisible()`, `.click()`, `.fill()`, etc. do the waiting.
- ✅ Use `page.waitForLoadState('domcontentloaded' | 'load' | 'networkidle')` only for full navigations (already used in `BasePage.waitForPageLoad()` and `LoginPage.goTo()`), not as a substitute for element-level waits.
- ✅ If an explicit wait is unavoidable, use `locator.waitFor({ state: 'visible' | 'attached' | 'detached' | 'hidden' })` scoped to the specific element, not a global timeout.
- ✅ For network-dependent flows, use `page.waitForResponse()` / `page.waitForRequest()` instead of guessing a delay.
- Reference: https://playwright.dev/docs/actionability and https://playwright.dev/docs/navigations

### 5. Assertions

Always use Playwright's **web-first (auto-retrying) assertions** from `expect`, not plain synchronous checks on values pulled out via `.textContent()`/`.innerText()` when avoidable.

- Prefer:
  ```typescript
  await expect(page).toHaveURL(/inventory.html/);
  await expect(locator).toBeVisible();
  await expect(locator).toHaveText('...');
  await expect(locator).toHaveCount(6);
  ```
  over manually awaiting a value and asserting on a plain string/number, since the former retries until the condition is met or times out, avoiding race conditions.
- Some specs in this repo (`checkout.spec.ts`, `login.spec.ts`) currently do `const text = await x.textContent(); expect(text).toContain(...)`. This works but doesn't retry — prefer `await expect(locator).toContainText(...)` / `toHaveText(...)` when refactoring or adding new assertions.
- Use `expect.soft()` when you want to collect multiple assertion failures in a single test run without stopping at the first one (useful for multi-field validation checks).
- One logical behavior per `test()` — avoid over-asserting unrelated things in a single test just to save time; split into focused tests instead (mirrors this repo's existing style of one test per scenario).
- Reference: https://playwright.dev/docs/test-assertions

### 6. API Testing

`tests/api/api.spec.ts` covers API testing against external demo APIs (Rick & Morty API, JSONPlaceholder) with Zod schema validation and `page.route()` mocking.

- **Current implementation uses the global `fetch()`**, which works but bypasses Playwright's built-in HTTP client. Prefer Playwright's [`APIRequestContext`](https://playwright.dev/docs/api-testing) (`request` fixture, or a dedicated `newContext().request`) for new API tests — it integrates with tracing/reporting, supports `baseURL`, cookies/auth reuse with UI tests, and doesn't require `await response.json()` boilerplate parity checks:
  ```typescript
  import { test, expect } from '@playwright/test';

  test('GET character profile', async ({ request }) => {
    const response = await request.get('https://rickandmortyapi.com/api/character/1');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.name).toBe('Rick Sanchez');
  });
  ```
- Keep validating response shape with **Zod schemas** (as already done for `CharacterSchema`) — this catches contract drift beyond individual field assertions. Define schemas near the spec or move to a shared `schemas/` folder if reused across specs.
- For request bodies/fixtures, keep using JSON files under `data/api/` (as with `create-post.json`) instead of inlining large payloads in the spec.
- Use `page.route()` (as in the "Mocked GET"/"Mocked error" tests) to stub network responses when testing UI behavior against specific API states (errors, empty states, slow responses) without depending on a real backend.
- Assert both the **status code** and the **response body/shape** — never just one or the other.
- API tests run in the dedicated `api` project (`testDir: './tests/api'`, no browser `use` config) — keep API-only specs there so they don't inherit UI device settings, and run them isolated via `npm run test:api`.

### 7. Test Isolation & Structure

- Every test gets a fresh `page`/browser context automatically — never rely on state leaking between tests (Playwright isolates by default). Don't add manual cleanup for that.
- Use `test.describe()` to group related scenarios (as done per feature: login, checkout, navigation) and `test.beforeEach()` for shared setup (e.g. login flow) instead of repeating it in every test.
- Tag smoke/regression tests with `@smoke` / `@regression` (already used) so CI can filter with `--grep`.
- Avoid conditional logic (`if/else` branching on page state) inside tests — a test should follow one deterministic path. If the app has multiple states, write separate tests.
- Don't use `test.only()` / `test.skip()` in committed code — `forbidOnly` is already enabled on CI via `playwright.config.ts`, but review locally before pushing.

### 8. Running Tests

#### Local Environment

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Run all tests
npx playwright test

# Run only UI/E2E tests
npm run test:ui

# Run only API tests
npm run test:api

# Run tests in headed mode
npx playwright test --headed

# Run a specific project
npx playwright test --project=e2e-chromium

# Filter by tag
npx playwright test --grep @smoke

# Debug a test interactively
npx playwright test --debug

# Show HTML report
npx playwright show-report

# Generate and open Allure report
npm run allure:report
```

#### Docker Environment

```bash
# Build and run tests
docker-compose up --build
```

#### Code Quality

```bash
npm run lint          # ESLint (includes eslint-plugin-playwright rules)
npm run format        # Prettier --write
npm run format:check  # Prettier --check
```

## 📝 Best Practices Summary

- **Locators:** Prefer user-facing locators (`getByRole`, `getByLabel`, `getByText`, `getByTestId`) over raw CSS/XPath. This app's `data-test` attributes are an acceptable stable exception. See [Locators](https://playwright.dev/docs/locators).
- **Waits:** Never use `waitForTimeout()`; rely on auto-waiting locators and web-first assertions. See [Actionability](https://playwright.dev/docs/actionability).
- **Assertions:** Use Playwright's web-first assertions (`expect(locator).toBeVisible()`, `toHaveText()`, `toHaveURL()`, etc.) so checks auto-retry instead of racing the UI. See [Assertions](https://playwright.dev/docs/test-assertions).
- **Page Objects:** Encapsulate locators/actions in `pages/`; keep assertions out of page objects and in the specs. See [POM](https://playwright.dev/docs/pom).
- **Fixtures:** Inject page objects and shared setup via `fixtures/baseFixture.ts` rather than instantiating classes inline in tests. See [Fixtures](https://playwright.dev/docs/test-fixtures).
- **API Testing:** Prefer the `request` fixture (`APIRequestContext`) over raw `fetch()` for new specs; validate both status and schema (Zod). See [API testing](https://playwright.dev/docs/api-testing).
- **Test Isolation:** One behavior per test, no shared mutable state, no conditional branching inside tests, group with `test.describe`/`test.beforeEach`.
- **Data:** Keep test data in `data/` (env vars for secrets); never hardcode credentials outside of `data/loginData.ts`-style fixtures.
- **Parallelism:** Tests run in parallel by default (`fullyParallel: true`); write tests so they don't depend on execution order.
- **CI:** `forbidOnly` and `retries` are already CI-aware in `playwright.config.ts` — don't hardcode CI-only behavior elsewhere.
