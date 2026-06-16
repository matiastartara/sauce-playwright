import { test, expect } from '../fixtures/baseFixture';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { loginData } from '../data/loginData';

test.describe('Sauce demo checkout test', () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goTo();
    await loginPage.login(loginData.validUser.username, loginData.validUser.password);
    await expect(page).toHaveURL(/inventory.html/);
  });

  test('Successful E2E purchase', async ({ page }) => {
    const cartPage = new CartPage(page);
    const inventoryPage = new InventoryPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addRandomProductToCart();
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillChekoutInformation('Matias', 'Test', '1234');
    await checkoutPage.finishCheckout();
    const confirmationMessage = await checkoutPage.getConfirmationMessage();

    await expect(checkoutPage.confirmationHeader).toBeVisible();
    expect(confirmationMessage).toContain('Thank you for your order!');
  });

  test('Card reflects correct name and price', async ({ page }) => {
    const cartPage = new CartPage(page);
    const inventoryPage = new InventoryPage(page);
    const { name, price } = await inventoryPage.addRandomProductToCart();
    console.log(`Added product: ${name} with price: ${price}`);
    await inventoryPage.navigateToCart();
    const CartProductName = await cartPage.getFirstItemName();
    const CartProductPrice = await cartPage.getFirstItemPrice();
    console.log(`Product in the cart: ${CartProductName} with price: ${CartProductPrice}`);

    expect(CartProductName).toBe(name);
    expect(CartProductPrice).toBe(price);
  });

  test('Item can be removed from cart', async ({ page }) => {
    const cartPage = new CartPage(page);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addRandomProductToCart();
    await inventoryPage.navigateToCart();
    const initialCartCount = await cartPage.getCartItemsCount();
    console.log(`Initial cart count: ${initialCartCount}`);
    await cartPage.removeItem(0);
    const finalCartCount = await cartPage.getCartItemsCount();

    console.log(`Final cart count after removal: ${finalCartCount}`);
    expect(finalCartCount).toBe(initialCartCount - 1);
  });

  test('Cart items persist after page reload', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addRandomProductToCart();

    expect(await inventoryPage.isCartBadgeVisible()).toBeTruthy();
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    await page.reload();
    expect(await inventoryPage.isCartBadgeVisible()).toBeTruthy();
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });
});
