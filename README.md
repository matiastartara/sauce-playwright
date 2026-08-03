# Saucedemo QA Playwright Project

This project is a test automation framework developed with **Playwright** and **TypeScript** for the [Saucedemo](https://www.saucedemo.com/) website.

## 🚀 Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (included with Node.js)

## 📦 Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

### Run with Docker Compose (Recommended)

Docker Compose simplifies container management and allows generated reports to be automatically saved to your local folder.

```bash
docker-compose up --build
```

This will build the image and execute the tests. Results will appear in the `playwright-report` and `test-results` folders of your project.

## 🛠️ Code Quality Tools

We have configured **ESLint** and **Prettier** to maintain clean, consistent, and error-free code.

### Formatting with Prettier

To automatically format all code following the project rules:

```bash
npm run format
```

To verify if the code complies with the format without modifying it:

```bash
npm run format:check
```

### Analysis with ESLint

To search for logical errors, bad practices, or rule violations in the code:

```bash
npm run lint
```

### How ESLint Works and Configuration

The project uses the flat configuration version (`eslint.config.mjs`) and integrates the following tools:

- **typescript-eslint**: Allows ESLint to understand and analyze TypeScript code, applying specific rules for the language.
- **eslint-plugin-playwright**: Includes recommended rules for Playwright tests, such as ensuring that `expect` calls have the corresponding `await`.
- **eslint-config-prettier**: Disables all ESLint rules that might conflict with Prettier's formatting, allowing both to coexist seamlessly.

#### Key Rules:

- **`playwright/no-focused-test`**: Throws an error if there are tests with `.only()`, preventing filtered tests from being committed to the repository.
- **`playwright/missing-playwright-await`**: Ensures that asynchronous Playwright calls are correctly awaited.
- **`@typescript-eslint/no-floating-promises`**: Forces promises to be handled, avoiding silent errors due to missing `await`.
- **`@typescript-eslint/await-thenable`**: Ensures that `await` is only used on functions or values that actually return a promise.

## 🧪 Running Tests

Run all tests:

```bash
npx playwright test
```

Run tests in UI mode:

```bash
npx playwright test --ui
```

### 🏷️ Running Tests by Tag

Tests are annotated with tags to allow selective execution. The currently supported tags are:

| Tag | Description |
|-----|-------------|
| `@smoke` | Critical path tests that validate core functionality |
| `@regression` | Full regression suite covering all test scenarios |

Run only **smoke** tests:

```bash
npx playwright test --grep @smoke
```

Run only **regression** tests:

```bash
npx playwright test --grep @regression
```

> [!NOTE]
> Tags are defined inside each test using Playwright's `tag` option, for example:
> ```typescript
> test('login with valid credentials', { tag: '@smoke' }, async ({ page }) => { ... });
> ```

### 📂 Projects

The Playwright configuration defines separate projects for **UI/e2e tests** and **API tests**. The npm scripts below automatically **delete `allure-results/` before each run** to ensure the Allure report only contains results from the current execution (Allure accumulates results across runs if the folder is not cleared):

| Command | Description |
|---------|-------------|
| `npm run test:ui` | Clears `allure-results/`, then runs E2E tests in Chromium (`e2e-chromium` project) |
| `npm run test:api` | Clears `allure-results/`, then runs API tests (`api` project) |

```bash
npm run test:ui

npm run test:api
```

If you want to run Playwright directly (without clearing the results folder):

```bash
npx playwright test --project=e2e-chromium
npx playwright test --project=api
```

Generate HTML test report:

```bash
npx playwright show-report
```

### 📊 Allure Reports

After running the tests, use these commands to generate and view the Allure report locally:

| Command | Description |
|---------|-------------|
| `npm run allure:generate` | Generates the static HTML report from `allure-results/` into the `allure-report/` folder |
| `npm run allure:open` | Opens the previously generated static report in the browser |
| `npm run allure:report` | Generates and immediately opens the report (combines the two above) |

```bash
# Generate and open the Allure report in one step:
npm run allure:report

# Or step by step:
npm run allure:generate
npm run allure:open
```

> [!NOTE]
> If you open the Allure report and see results from multiple browsers or past runs, it means `allure-results/` was not cleared before the last execution. Always use `npm run test:ui` or `npm run test:api` instead of running `npx playwright test` directly to avoid this.

### 🌐 Live Allure Reports (GitHub Pages)

Every push to `main`/`master` automatically publishes the Allure reports to **GitHub Pages**:

| Project | URL |
|---------|-----|
| E2E (Chromium) | `https://matiastartara.github.io/sauce-playwright/e2e/` |
| API | `https://matiastartara.github.io/sauce-playwright/api/` |

The reports include **trend charts** and **history** — each new run preserves the results from previous executions so you can track pass/fail evolution over time.

#### ⚙️ One-time GitHub configuration required

Before the first push, do these two things in your repository settings:

**1. Enable GitHub Pages**

Go to **Settings → Pages** and set:
- Source: `Deploy from a branch`
- Branch: `gh-pages` / `/ (root)`

> [!IMPORTANT]
> The `gh-pages` branch is created automatically by the workflow on the first push. If you don't see it yet in the dropdown, run the workflow once first, then come back and set this.

**2. Enable workflow write permissions**

Go to **Settings → Actions → General → Workflow permissions** and select:
- ✅ `Read and write permissions`
- Click **Save**

This allows the workflow to push the generated report to the `gh-pages` branch.

> [!NOTE]
> GitHub Pages is **free for public repositories**. For private repositories it requires a GitHub Pro or Team plan.

## 🐳 Docker

This project includes Docker support, allowing tests to be run in an isolated and consistent environment.

### Run with Docker Compose (Recommended)

Docker Compose simplifies container management, handles environment variables, and automatically syncs reports to your host machine.

Build and run tests:
```bash
docker compose up --build
```

Run tests and automatically remove the container when done:
```bash
docker compose run --rm --build playwright-tests
```

Clean up containers created by `up`:
```bash
docker compose down
```

### Manual Docker Commands

Build the image manually:
```bash
docker build -t saucedemo-playwright .
```

Run tests manually:
```bash
docker run --rm saucedemo-playwright
```

### Clean up Docker resources

Delete the built image:
```bash
docker rmi sauce-playwright
```

Clean up all unused containers, networks, images, and cache:
```bash
docker system prune
```
