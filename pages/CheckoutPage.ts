import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly continueButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly errorMessage: Locator;
  readonly finishButton: Locator;
  readonly confirmationHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.continueButton = page.locator('[data-test="continue"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.confirmationHeader = page.locator('[data-test="complete-header"]');
  }

  async fillChekoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async getConfirmationMessage() {
    return await this.confirmationHeader.textContent();
  }
}
