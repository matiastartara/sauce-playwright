import { test, expect } from '../fixtures/baseFixture';

test.describe('Sauce demo login tests', () => {
  test('Unsuccessful login', async ({ loginPage }) => {
    await loginPage.goTo();
    await loginPage.login('standard_user', 'wrong_password');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match any user in this service');
  });

  test('Successful login', async ({ loginPage, page }) => {
    await loginPage.goTo();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Check username required', async ({ loginPage }) => {
    await loginPage.goTo();
    await loginPage.login('', 'wrong_password');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username is required');
  });

  test('Check password required', async ({ loginPage }) => {
    await loginPage.goTo();
    await loginPage.login('standard_user', '');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Password is required'); 
  })
});
