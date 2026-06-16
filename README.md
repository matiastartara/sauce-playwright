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

Generate HTML test report:

```bash
npx playwright show-report
```

Generate Allure test report:

```bash
# Serve and open the Allure report immediately:
npx allure serve allure-results

# Or generate the static HTML report folder:
npx allure generate allure-results --clean -o allure-report

# Open the generated static Allure report:
npx allure open allure-report
```

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
