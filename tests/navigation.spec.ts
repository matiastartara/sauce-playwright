import { test, expect } from '../fixtures/baseFixture';
import { CartPage } from '../pages/CartPage';
import { InventoryPage } from '../pages/InventoryPage';
import { NavigationMenu } from '../pages/NavigationMenu';

test.describe('Sauce demo navigation test', () => {
    test('Open and close navigation menu', async ({ page, loginPage }) => {
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory.html/);

        const navigationMenu = new NavigationMenu(page);
        await navigationMenu.openMenu();
        await expect(navigationMenu.allItemsLink).toBeVisible();
        await navigationMenu.closeMenu();
        await expect(navigationMenu.allItemsLink).toBeHidden();
    });

    test('All items link returns to inventory', async ({ page, loginPage }) => {
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory.html/);

        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const navigationMenu = new NavigationMenu(page);

        await inventoryPage.addRandomProductToCart();
        await inventoryPage.navigateToCart();
        await expect(cartPage.cartItems).toBeVisible();
        await navigationMenu.openMenu();
        await navigationMenu.navigateToAllItems();
        await expect(inventoryPage.inventoryItems).toHaveCount(6);
        await expect(inventoryPage.inventoryItems).toHaveCount(6);
        await expect(inventoryPage.addToCartButton).toBeVisible();
    });

    test('Reset app state clears cart badge', async ({page, loginPage }) => {
        await loginPage.goTo();
        await loginPage.login('standard_user', 'secret_sauce');
        await expect(page).toHaveURL(/inventory.html/);

        const inventoryPage = new InventoryPage(page);
        const navigationMenu = new NavigationMenu(page);
        await inventoryPage.addRandomProductToCart();
        const cartAmount = await inventoryPage.cartBadge.textContent();
        console.log('cart amount: '+cartAmount);

        await navigationMenu.openMenu();
        await navigationMenu.resetAppState();
        await expect(inventoryPage.cartBadge).toBeHidden();
    })


})