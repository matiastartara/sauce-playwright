import { test, expect } from '../../fixtures/baseFixture';
import { InventoryPage } from '../../pages/InventoryPage';
import { loginData } from '../../data/loginData';

test.describe('Inventory test', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goTo();
    await loginPage.login(loginData.validUser.username, loginData.validUser.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Check sorted products by price low to high', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortByPriceLowToHigh();

    const itemPrices = await inventoryPage.getItemPrices();
    const prices = itemPrices.map((text) => parseFloat(text.replace('$', '')));

    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('Check sorted products by price high to low', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortByPriceHighToLow();

    const itemPrices = await inventoryPage.getItemPrices();
    const prices = itemPrices.map((text) => parseFloat(text.replace('$', '')));

    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('Check sorted products by name A to Z', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortByItemNameAToZ();

    const itemNames = await inventoryPage.getItemNames();

    const sortedNames = [...itemNames].sort((a, b) => a.localeCompare(b));
    expect(itemNames).toEqual(sortedNames);
  });


});
