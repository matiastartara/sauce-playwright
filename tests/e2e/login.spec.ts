import { test, expect } from '../../fixtures/baseFixture';
import { loginData } from '../../data/loginData';

test.describe('Sauce demo login tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goTo();
  });

  test('Unsuccessful login @smoke', async ({ loginPage }) => {
    await loginPage.login(loginData.invalidUser.username, loginData.invalidUser.password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match any user in this service');
  });

  test('Successful login @smoke', async ({ loginPage, page }) => {
    await loginPage.login(loginData.validUser.username, loginData.validUser.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Check username required', async ({ loginPage }) => {
    await loginPage.login(loginData.missingUsername.username, loginData.missingUsername.password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username is required');
  });

  test('Check password required', async ({ loginPage }) => {
    await loginPage.login(loginData.missingPassword.username, loginData.missingPassword.password);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Password is required');
  });
});
