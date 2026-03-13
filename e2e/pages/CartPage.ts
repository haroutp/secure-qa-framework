import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  // The page instance
  readonly page: Page;

  // All selectors for this page — defined ONCE
  readonly pageTitle: Locator;
  readonly inventoryItem: Locator;
  readonly inventoryItemName: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('title');
    this.inventoryItem = page.getByTestId('inventory-item');
    this.inventoryItemName = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  // Actions — things a user does on this page
  async removeItem(name: string) {
    await this.inventoryItem
        .filter({ hasText: name})
        .getByRole('button', {name: 'Remove'})
        .click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async checkout() {
    await this.checkoutButton.click()
  }

  // Assertions — things you verify on this page
  async expectTitle(text: string) {
    await expect(this.pageTitle).toHaveText(text);
  }

  async expectProductCount(count: number) {
    await expect(this.inventoryItem).toHaveCount(count);
  }

  async expectInventoryItem(n: number, name: string) {
    await expect(this.inventoryItemName.nth(n)).toHaveText(name);
  }

  async expectItemVisible(name: string) {
    await expect(this.inventoryItemName).toBeVisible();
  }

  async expectItemIsRemoved(name: string) {
    await expect(this.inventoryItem).not.toBeVisible();
  }
}