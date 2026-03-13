import { Page, Locator, expect } from '@playwright/test';


export class CheckoutPage {
  // The page instance
  readonly page: Page;

  // All selectors for this page — defined ONCE
  readonly pageTitle: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;
  readonly error: Locator;
  readonly inventoryItemName: Locator;
  readonly priceLabel: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('title');
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.cancelButton = page.getByTestId('cancel');
    this.continueButton = page.getByTestId('continue');
    this.error = page.getByTestId('error');
    this.inventoryItemName = page.getByTestId('inventory-item-name');
    this.priceLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  // Actions — things a user does on this page
  async fillFirstName(firstName: string) {
    await this.firstName.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastName.fill(lastName);
  }

  async fillPostalCode(postalcode: string) {
    await this.postalCode.fill(postalcode);
  }

  async fillCheckoutInformation(user: { firstName: string; lastName: string; postalCode: string }) {
    await this.fillFirstName(user.firstName);
    await this.fillLastName(user.lastName);
    await this.fillPostalCode(user.postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }

  async finishCheckout() {
    await expect(this.finishButton).toBeVisible();
    await this.finishButton.click();
  }
  // Assertions — things you verify on this page
  async expectTitle(text: string) {
    await expect(this.pageTitle).toHaveText(text);
  }

  async expectInventoryItem(n: number, name: string) {
    await expect(this.inventoryItemName.nth(n)).toHaveText(name);
  }

  async expectItemVisible(name: string) {
    await expect(this.inventoryItemName).toBeVisible();
  }

  async expectPriceLabel() {
    await expect(this.priceLabel).toBeVisible();
  }

  async expectCheckoutCompleteHeader() {
    await expect(this.completeHeader).toBeVisible();
  }

  async expectBackHomeButton() {
    await expect(this.backHomeButton).toBeVisible();
  }
}