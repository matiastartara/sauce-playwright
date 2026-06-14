import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly checkoutButton: Locator;
  readonly removeBtns: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.removeBtns = page.locator('[data-test^="remove"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
  }

  async removeItem(index: number) {
    await this.removeBtns.nth(index).click();
  }

  async getCartItemsCount() {
    return await this.cartItems.count();
  }

  async getItemName(index: number) {
    return await this.cartItems.nth(index).locator('[data-test="inventory-item-name"]').innerText();
  }

  async getItemPrice(index: number) {
    return await this.cartItems
      .nth(index)
      .locator('[data-test="inventory-item-price"]')
      .innerText();
  }

  async getItemByIndex(index: number) {
    const name = await this.getItemName(index);
    const price = await this.getItemPrice(index);
    return { name, price };
  }

  async getFirstItemPrice() {
    return await this.getItemPrice(0);
  }

  async getFirstItemName() {
    return await this.getItemName(0);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
