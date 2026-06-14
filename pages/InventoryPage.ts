import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly inventoryItems: Locator;
  readonly addToCartButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.addToCartButton = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async isCartBadgeVisible() {
    return await this.cartBadge.isVisible();
  }

  async navigateToCart() {
    await this.addToCartButton.click();
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.isCartBadgeVisible()) {
      const text = await this.cartBadge.textContent();
      return text ? parseInt(text, 10) : 0;
    }
    return 0;
  }

  async addProductToCart(index: number): Promise<{ name: string; price: string }> {
    const randomItem = this.inventoryItems.nth(index);
    const name = await randomItem.locator('[data-test="inventory-item-name"]').innerText();
    const price = await randomItem.locator('[data-test="inventory-item-price"]').innerText();
    const addButton = randomItem.locator('[data-test^="add-to-cart-"]');
    await addButton.click();
    return { name, price };
  }

  async addRandomProductToCart() {
    const itemCount = await this.inventoryItems.count();
    const randomIndex = Math.floor(Math.random() * itemCount);
    return await this.addProductToCart(randomIndex);
  }
}
