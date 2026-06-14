# Project Agent - SauceDemo Playwright Automation

This project is a test automation suite for the [SauceDemo](https://www.saucedemo.com/) website using Playwright and TypeScript. It follows industry best practices for scalability and maintainability.

## 🚀 Tech Stack

- **Framework:** [Playwright](https://playwright.dev/)
- **Language:** TypeScript
- **Pattern:** Page Object Model (POM)
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions

## 📁 Project Structure

```text
.
├── fixtures/          # Custom Playwright fixtures (e.g., baseFixture.ts)
├── pages/             # Page Object Model classes
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/             # Test specifications (*.spec.ts)
├── playwright.config.ts # Playwright configuration
├── Dockerfile         # Docker image definition
└── docker-compose.yml # Docker orchestration
```

## 🛠️ How to Work with Playwright in this Project

### 1. Page Object Model (POM)

All interaction logic with the UI must be encapsulated within classes in the `pages/` directory. Each page should represent a specific part of the application.

- Use meaningful method names (e.g., `submitLoginForm()` instead of `clickButton()`).
- Keep selectors private or localized within the page class.

### 2. Fixtures

We use custom fixtures in `fixtures/baseFixture.ts` to simplify test setup. This allows us to inject page objects directly into tests.

- **Usage in tests:**
  ```typescript
  import { test } from '../fixtures/baseFixture';
  test('login test', async ({ loginPage }) => {
    await loginPage.login('user', 'pass');
  });
  ```

### 3. Running Tests

#### Local Environment

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Show report
npx playwright show-report
```

#### Docker Environment

```bash
# Build and run tests
docker-compose up --build
```

## 📝 Best Practices

- **Locators:** Prefer user-facing locators like `getByRole`, `getByText`, or `getByLabel` over CSS/XPath.
- **Assertions:** Use Playwright's web-first assertions (e.g., `expect(locator).toBeVisible()`).
- **Data:** Use environment variables or configuration files for sensitive data.
- **Parallelism:** Tests are configured to run in parallel by default to save time.
